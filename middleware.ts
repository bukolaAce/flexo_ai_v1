// src/proxy.ts  (or middleware.ts, depending on your Next.js version — see note below)
import { auth } from "@/lib/auth/server";
export default auth.middleware({ loginUrl: "/auth/sign-in" });

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*"],
};