import { and, eq, isNotNull } from "drizzle-orm";

import { db } from "@/db";
import { user } from "@/db/schema";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return Response.json(
        { exists: false, error: "Email obrigatório." },
        { status: 400 },
      );
    }

    // 🔹 Busca o usuário com role definida (athlete ou supporter)
    const existing = await db
      .select()
      .from(user)
      .where(
        and(
          eq(user.email, email),
          isNotNull(user.role), // garante que o campo role não é null
        ),
      )
      .limit(1);

    // 🔹 Caso tenha apenas e-mail (criado automaticamente pelo Google),
    // e nenhuma role atribuída → não consideramos como "conta criada"
    const exists = existing.length > 0 && existing[0].role !== null;

    return Response.json({ exists });
  } catch (error) {
    console.error("[check-user-exists] Erro:", error);
    return Response.json(
      { exists: false, error: "Erro interno." },
      { status: 500 },
    );
  }
}
