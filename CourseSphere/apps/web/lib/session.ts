"use server";

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  bio?: string;
  image?: string;
  role?: {
    id: number;
    name: string;
  };
};

export type Session = {
  user: SessionUser;
  accessToken: string;
};

const secretKey = process.env.SESSION_SECRET_KEY!;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(payload: Session) {
  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);

  const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiredAt,
    sameSite: "lax",
    path: "/",
  });

  //TODO CREATE REFRESH TOKEN
}

export async function getSession(): Promise<Session | null> {
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as Session;
  } catch (err) {
    console.error("Failed to verify session:", err);
    return null;
  }
}

export async function deleteSession() {
  (await cookies()).delete("session");
}
