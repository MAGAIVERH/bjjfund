import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/db";
import * as schema from "@/db/schema";
import type { ExtendedSession,ExtendedUser } from "@/lib/auth-types";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: null,
      },
    },
  },

  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://seu-dominio.vercel.app",
  ],

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  callbacks: {
    session: async ({
      session,
      user,
    }: {
      session: ExtendedSession;
      user: ExtendedUser;
    }): Promise<ExtendedSession> => {
      return {
        ...session,
        user: {
          ...session.user,
          role: user.role, // pega a role direto do banco
        },
      };
    },
  },
});
