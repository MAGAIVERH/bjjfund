import { createAuthClient } from "better-auth/react";
import type { ExtendedSession } from "./auth-types";

/**
 * Cria o cliente normalmente (NÃO passa genérico aqui).
 * O erro que você viu acontece quando tentamos passar um tipo onde a lib espera opções (ClientOptions).
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

/**
 * Extraímos os hooks originais…
 */
const { useSession: _useSession, signIn, signOut } = authClient;

/**
 * …e reexportamos `useSession` com tipagem estendida.
 * Assim, TODO lugar que já importa `useSession` continua igual,
 * mas `data?.user.role` passa a ser reconhecido pelo TS.
 */
export const useSession = () =>
  _useSession() as { data: ExtendedSession | null; isPending: boolean };

export { signIn, signOut };

/** Opcional: reexporta o tipo para quem quiser usar */
export type { ExtendedSession };
