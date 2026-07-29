"use client";

import { NeonAuthUIProvider } from "@neondatabase/auth-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { authClient } from "@/lib/auth/client";
import AuthProvider from "@/context/AuthContext";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={() => {
        // Refreshes Server Components after sign-in/sign-out
        router.refresh();
      }}
      redirectTo="/onboarding"
      Link={Link}
    >
      <AuthProvider>{children}</AuthProvider>
    </NeonAuthUIProvider>
  );
}