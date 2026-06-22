import { BaseGraphQLAPIClient } from "@ikas/admin-api-client";
import { AuthTokenManager } from "./token-manager";

export { BaseGraphQLAPIClient };

export function getIkas(accessToken: string) {
  return new BaseGraphQLAPIClient({
    accessToken,
    graphApiUrl: process.env.NEXT_PUBLIC_GRAPH_API_URL!,
  });
}

export async function getIkasForStore(store: string) {
  const accessToken = await AuthTokenManager.refreshIfExpired(store);
  if (!accessToken) throw new Error(`No valid token for store: ${store}`);
  return getIkas(accessToken);
}
