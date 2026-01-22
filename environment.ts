export default function getEnv(env: "DEV" | "STAGE" | "PROD") {
  switch (env) {
    case "DEV":
      return {
        SERVER_URL: "http://localhost:8001/",
        WS_SERVER_URL: "ws://localhost:8001/",
      };
    case "STAGE":
      return {
        SERVER_URL: "https://civora-api-stage.up.railway.app/",
        WS_SERVER_URL: "wss://civora-api-stage.up.railway.app/",
      };
    case "PROD":
      return {
        SERVER_URL: "https://civora-api.up.railway.app/",
        WS_SERVER_URL: "wss://civora-api.up.railway.app/",
      };
    default:
      return {
        SERVER_URL: "http://localhost:8001/",
        WS_SERVER_URL: "ws://localhost:8001/",
      };
  }
}
