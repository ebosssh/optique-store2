import { NextResponse } from "next/server";
import { ADMIN_COOKIE, checkPassword, createSessionToken } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const { password } = (await request.json()) as { password?: string };

  if (!password || !checkPassword(password)) {
    return NextResponse.json({ error: "Невірний пароль" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
