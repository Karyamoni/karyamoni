import { db } from "@/lib/db";

interface TokenSet {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export const AuthTokenManager = {
  async getToken(store: string) {
    return db.authToken.findUnique({ where: { store } });
  },

  async saveToken(store: string, tokens: TokenSet) {
    return db.authToken.upsert({
      where: { store },
      create: { store, ...tokens },
      update: tokens,
    });
  },

  async refreshIfExpired(store: string): Promise<string | null> {
    const record = await db.authToken.findUnique({ where: { store } });
    if (!record) return null;

    if (record.expiresAt > new Date()) return record.accessToken;

    // Token expired — refresh
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_URL}/oauth/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
          client_secret: process.env.CLIENT_SECRET!,
          refresh_token: record.refreshToken,
        }),
      }
    );

    if (!res.ok) return null;

    const data = (await res.json()) as {
      access_token: string;
      refresh_token: string;
      expires_in: number;
    };

    const expiresAt = new Date(Date.now() + data.expires_in * 1000);
    await AuthTokenManager.saveToken(store, {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt,
    });

    return data.access_token;
  },
};
