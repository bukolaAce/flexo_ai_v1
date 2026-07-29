// src/app/api/auth/[...path]/route.ts
import { auth } from "@/lib/auth/server";  // ← not "@/lib/auth/client"

export const { GET, POST } = auth.handler();