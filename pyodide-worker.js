const PYODIDE_BASE_URL = "https://cdn.jsdelivr.net/pyodide/v0.28.2/full/";

let pyodideReadyPromise = null;

const ensurePyodide = async () => {
  if (!pyodideReadyPromise) {
    importScripts(`${PYODIDE_BASE_URL}pyodide.js`);
    pyodideReadyPromise = loadPyodide({ indexURL: PYODIDE_BASE_URL });
  }

  return pyodideReadyPromise;
};

const serializeError = (error) => ({
  name: error?.name || "Error",
  message: error?.message || String(error || "Unknown Python worker error"),
  stack: error?.stack || "",
});

self.addEventListener("message", async (event) => {
  const { id, type } = event.data || {};

  try {
    const pyodide = await ensurePyodide();

    if (type === "init") {
      self.postMessage({ id, ok: true, result: true });
      return;
    }

    if (type !== "run") {
      throw new Error(`Unsupported worker request: ${type}`);
    }

    const { code, args, methodName } = event.data;
    pyodide.globals.set("__case_json", JSON.stringify({ args }));

    const rawResult = pyodide.runPython(`
import json as __json

${code}

__case = __json.loads(__case_json)
__args = __case["args"]
__result = Solution().${methodName}(*__args)
if __result is None and __args:
    __result = __args[0]
__result
`);

    const result = rawResult && typeof rawResult.toJs === "function" ? rawResult.toJs() : rawResult;

    if (rawResult && typeof rawResult.destroy === "function") {
      rawResult.destroy();
    }

    self.postMessage({ id, ok: true, result });
  } catch (error) {
    self.postMessage({ id, ok: false, error: serializeError(error) });
  }
});
