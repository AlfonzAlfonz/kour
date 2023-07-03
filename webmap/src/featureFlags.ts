export const featureFlags = {
  debugControls: import.meta.env.VITE_DEBUG_CONTROLS === "1",
  debugInit: import.meta.env.VITE_DEBUG_INIT === "1",
};
