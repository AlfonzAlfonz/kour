/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEBUG_CONTROLS: string;
  readonly VITE_DEBUG_INIT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
