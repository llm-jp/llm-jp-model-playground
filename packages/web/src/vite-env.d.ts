/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_API_ENDPOINT: string;
  readonly VITE_APP_REGION: string;
  readonly VITE_APP_USER_POOL_ID: string;
  readonly VITE_APP_USER_POOL_CLIENT_ID: string;
  readonly VITE_APP_IDENTITY_POOL_ID: string;
  readonly VITE_APP_PREDICT_STREAM_FUNCTION_ARN: string;
  readonly VITE_APP_RAG_ENABLED: string;
  readonly VITE_APP_SELF_SIGN_UP_ENABLED: string;
  readonly VITE_APP_SAGEMAKER_ENDPOINT_NAME: string;
  readonly VITE_APP_SAGEMAKER_ENDPOINT_CONFIG_NAME: string;
  readonly VITE_APP_SAGEMAKER_MODELS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
