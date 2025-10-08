import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();
// Exportando os hooks prontos para usar nos components

export const { useSession } = authClient;
