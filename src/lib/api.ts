/** 后端 API 地址；开发环境默认连接本地 FastAPI。 */
export const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined) ?? "http://localhost:8000";
