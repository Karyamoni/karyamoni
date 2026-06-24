import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  store?: string;
  jwt?: string;
  oauthState?: string;
  linkToken?: string;
}

const isHttps = process.env.NEXT_PUBLIC_DEPLOY_URL?.startsWith("https://") ?? false;

export const sessionOptions: SessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: "karyamoni_ikas_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production" || isHttps,
    httpOnly: true,
    sameSite: "none",
  },
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}
