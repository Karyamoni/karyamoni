"use client";

// Typed frontend → backend bridge.
// All functions require a JWT from @ikas/app-bridge.
// Direct IKAS GraphQL calls from browser are forbidden.

export const ApiRequests = {
  getMerchant: async (jwt: string) => {
    const res = await fetch("/api/ikas/get-merchant", {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    if (!res.ok) throw new Error("Failed to fetch merchant");
    return res.json() as Promise<{
      id: string;
      name: string;
      email: string;
      storeUrl: string;
    }>;
  },
};
