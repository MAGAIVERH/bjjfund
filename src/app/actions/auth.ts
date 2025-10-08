"use server";
import { db } from "@/db";
import { userRoles, roles } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Salva a role do usuário
 */
export async function setRole(userId: string, role: "athlete" | "supporter") {
  // Busca role no banco
  const [dbRole] = await db
    .select()
    .from(roles)
    .where(eq(roles.name, role)) // ✅ aqui usamos eq correto
    .limit(1)
    .execute();

  if (!dbRole) {
    throw new Error(`Role "${role}" não encontrada`);
  }

  // Insere no user_roles
  await db
    .insert(userRoles)
    .values({
      userId,
      roleId: dbRole.id,
      primary: true,
    })
    .execute();
}
