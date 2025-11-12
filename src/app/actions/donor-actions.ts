"use server";

import { db } from "@/db";
import { user, donations, athleteDonors, session, account } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * 🔥 Deleta completamente a conta de um usuário doador
 * - Remove login, sessão, credenciais
 * - Mantém as doações, apenas remove o donorUserId (fica NULL)
 * - Remove relacionamento de supporter no athleteDonors
 */
export async function deleteDonorAccount(userId: string) {
  try {
    // 1️⃣ Remover sessões ativas do usuário
    await db.delete(session).where(eq(session.userId, userId));

    // 2️⃣ Remover contas de login social (Google, etc)
    await db.delete(account).where(eq(account.userId, userId));

    // 3️⃣ Remover relacionamento atleta x doador (mas doações ficam)
    await db.delete(athleteDonors).where(eq(athleteDonors.donorUserId, userId));

    // 4️⃣ Remover o usuário (isso NÃO apaga doações, apenas zera donorUserId)
    await db.delete(user).where(eq(user.id, userId));

    return { success: true };
  } catch (err) {
    console.error("[deleteDonorAccount] Erro:", err);
    return { success: false, error: "Não foi possível excluir a conta." };
  }
}
