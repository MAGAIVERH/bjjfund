import type { Session } from "better-auth/types";

export interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
  role?: "athlete" | "supporter" | "admin"; // ✅ adiciona o campo role
}

export interface ExtendedSession extends Omit<Session, "user"> {
  user: ExtendedUser;
}
