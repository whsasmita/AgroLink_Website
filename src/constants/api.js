const DEFAULT_DEV_BASE_URL = "http://localhost:8090/api/v1";
const DEFAULT_PROD_BASE_URL = "https://api.goagrolink.com/api/v1";

export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? DEFAULT_DEV_BASE_URL : DEFAULT_PROD_BASE_URL);

const resolveWsUrl = (baseUrl) => {
  const explicitWsUrl = import.meta.env.VITE_WS_URL;
  if (explicitWsUrl) return explicitWsUrl;

  try {
    const url = new URL(baseUrl);
    const protocol = url.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${url.host}/api/v1/ws`;
  } catch {
    return import.meta.env.DEV
      ? "ws://localhost:8090/api/v1/ws"
      : "wss://api.goagrolink.com/api/v1/ws";
  }
};

export const WS_URL = resolveWsUrl(BASE_URL);
