import { AppBridgeHelper } from "@ikas/app-helpers";

const TOKEN_KEY = "token";

export class TokenHelpers {
  static getTokenForIframeApp = async (): Promise<string | null> => {
    if (window.self !== window.top) {
      try {
        const authorizedAppId = (await AppBridgeHelper.getAuthorizedAppId()) || null;
        let token = sessionStorage.getItem(`${TOKEN_KEY}-${authorizedAppId}`);

        if (token) {
          const tokenData = JSON.parse(atob(token.split(".")[1]));
          if (new Date().getTime() < tokenData.exp * 1000) {
            return token;
          }
          sessionStorage.removeItem(`${TOKEN_KEY}-${authorizedAppId}`);
        }

        token = (await AppBridgeHelper.getNewToken()) || null;

        if (token) {
          sessionStorage.setItem(`${TOKEN_KEY}-${authorizedAppId}`, token);
          return token;
        }
      } catch (error) {
        console.error("Error retrieving token from AppBridge:", error);
      }
    }
    return null;
  };
}
