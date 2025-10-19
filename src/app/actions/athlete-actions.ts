"use server";

import { db } from "@/db";
import { athletes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

/**
 * Cria um novo atleta vinculado a um usuário
 */
export async function createAthlete(data: {
  userId: string;
  faixa: string;
  escola: string;
  nascimento: string; // deixa como string
  cidade: string;
  bio?: string;
  image?: string;
  evento?: string; // <-- já existia
  ouro?: string; // 🥇 novo campo
  prata?: string; // 🥈 novo campo
  bronze?: string; // 🥉 novo campo
}) {
  try {
    const id = randomUUID();

    await db.insert(athletes).values({
      id,
      userId: data.userId,
      faixa: data.faixa,
      escola: data.escola,
      nascimento: data.nascimento,
      cidade: data.cidade,
      bio: data.bio || null,
      image: data.image ?? undefined,
      evento: data.evento || null,
      ouro: data.ouro || "0", // 🥇 novo campo
      prata: data.prata || "0", // 🥈 novo campo
      bronze: data.bronze || "0", // 🥉 novo campo
    });

    return { success: true, id };
  } catch (error) {
    console.error("[createAthlete] Erro ao criar atleta:", error);
    return { success: false, error: "Erro ao criar atleta." };
  }
}

/**
 * Obtém informações do atleta pelo userId
 */
export async function getAthleteByUserId(userId: string) {
  try {
    const athlete = await db
      .select()
      .from(athletes)
      .where(eq(athletes.userId, userId))
      .limit(1);

    if (!athlete || athlete.length === 0) {
      return { success: false, error: "Atleta não encontrado." };
    }

    return { success: true, athlete: athlete[0] };
  } catch (error) {
    console.error("[getAthleteByUserId] Erro ao buscar atleta:", error);
    return { success: false, error: "Erro ao buscar atleta." };
  }
}

/**
 * Atualiza informações do atleta
 */
export async function updateAthlete(
  userId: string,
  data: Partial<{
    faixa: string;
    escola: string;
    nascimento: string;
    cidade: string;
    bio: string;
    image: string;
    evento: string;
    ouro: string; // 🥇 novo campo
    prata: string; // 🥈 novo campo
    bronze: string; // 🥉 novo campo
  }>,
) {
  try {
    await db
      .update(athletes)
      .set({
        faixa: data.faixa,
        escola: data.escola,
        nascimento: data.nascimento,
        cidade: data.cidade,
        bio: data.bio,
        image: data.image,
        evento: data.evento,
        ouro: data.ouro,
        prata: data.prata,
        bronze: data.bronze,
      })
      .where(eq(athletes.userId, userId));

    return { success: true };
  } catch (error) {
    console.error("[updateAthlete] Erro ao atualizar atleta:", error);
    return { success: false, error: "Erro ao atualizar atleta." };
  }
}

/**
 * Deleta um atleta pelo userId
 */
export async function deleteAthlete(userId: string) {
  try {
    await db.delete(athletes).where(eq(athletes.userId, userId));
    return { success: true };
  } catch (error) {
    console.error("[deleteAthlete] Erro ao deletar atleta:", error);
    return { success: false, error: "Erro ao deletar atleta." };
  }
}
