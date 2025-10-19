import { createAuthClient } from "better-auth/react";
import type { ExtendedSession } from "./auth-types";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

// Exportando os hooks prontos para usar nos components
export const { useSession } = authClient;

// Tipando corretamente a sessão para usar role
export type { ExtendedSession };
