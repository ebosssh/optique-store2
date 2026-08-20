import { NextResponse } from "next/server";
import { ADMIN_COOKIE, checkPassword, createSessionToken } from "@/lib/admin-auth";
import { clearAttempts, isRateLimited, recordFailedAttempt } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Забагато спроб входу. Спробуйте пізніше" }, { status: 429 });
  }

  const { password } = (await request.json()) as { password?: string };

  if (!password || !checkPassword(password)) {
    recordFailedAttempt(ip);
    return NextResponse.json({ error: "Невірний пароль" }, { status: 401 });
  }

  clearAttempts(ip);
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
