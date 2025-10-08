import { db } from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  emailAndPassword: {
    enabled: true,
  },

  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://seu-dominio.vercel.app", // substitua pelo domínio real depois do deploy
  ],

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  events: {
    async onUserCreated(context: any) {
      try {
        // ⚠️ Proteção: nem sempre `context.request` existe
        let role = "supporter";

        if (context?.request) {
          try {
            const body = await context.request.json();
            if (body?.role) role = body.role;
          } catch {
            // ignora caso não tenha corpo JSON
          }
        }

        // Atualiza o usuário com a role definida
        await db
          .update(schema.user)
          .set({ role })
          .where(eq(schema.user.id, context.user.id));

        console.log(
          `✅ Role "${role}" salva para o usuário ${context.user.email}`,
        );
      } catch (error) {
        console.error("❌ Erro ao salvar o role do usuário:", error);
      }
    },
  },
});
