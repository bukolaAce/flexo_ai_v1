"use client";

import { Dumbbell } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/Button";
import { useAuth } from "@/context/AuthContext";
import { UserButton } from "@neondatabase/auth-ui";

export default function Navbar() {
  const { user, plan } = useAuth();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-background)]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        <Link
          href="/"
          className="flex items-center gap-2 text-[var(--color-foreground)] shrink-0"
        >
          <Dumbbell className="w-6 h-6 text-[var(--color-accent)]" />
          <span className="font-semibold text-lg">FlexoAI</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3 shrink-0">
          {user ? (
            <>
              {plan && (
                <Link href="/profile">
                  <Button variant="ghost" size="sm">
                    My Plan
                  </Button>
                </Link>
              )}
              <UserButton className="bg-(--color-accent)" />
            </>
          ) : (
            <>
              <Link href="/auth/sign-in">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}