declare namespace NodeJS {
  interface ProcessEnv {
    APP_VERSION?: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_AI_API_BASE_URL: string;
  readonly VITE_API_URL: string;
  readonly VITE_GITHUB_CLIENT_ID: string;
  readonly VITE_GITHUB_REDIRECT_URI: string;
  readonly VITE_APP_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}