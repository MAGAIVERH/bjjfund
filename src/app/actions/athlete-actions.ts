"use server";

import { db } from "@/db";
import { athletes, campaigns, donations, user } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

/**
 * Cria um novo atleta vinculado a um usuário
 */
export async function createAthlete(data: {
  userId: string;
  faixa: string;
  escola: string;
  nascimento: string;
  cidade: string;
  bio?: string;
  image?: string; // rosto
  fullImage?: string; // corpo inteiro
  historia?: string; // história
  evento?: string;
  ouro?: string;
  prata?: string;
  bronze?: string;
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
      image: data.image ?? null,
      fullImage: data.fullImage ?? null,
      historia: data.historia ?? null,
      evento: data.evento || null,
      ouro: data.ouro || "0",
      prata: data.prata || "0",
      bronze: data.bronze || "0",
    });

    return { success: true, id };
  } catch (error) {
    console.error("[createAthlete] Erro ao criar atleta:", error);
    return { success: false, error: "Erro ao criar atleta." };
  }
}

/**
 * ✅ Obtém informações completas do atleta pelo userId
 * Inclui soma de todas as doações diretas (independente de campanha)
 */
export async function getAthleteByUserId(userId: string) {
  try {
    const result = await db
      .select({
        athleteId: athletes.id,
        userId: athletes.userId,
        name: user.name,
        userImage: user.image, // imagem do Google
        athleteImage: athletes.image, // rosto
        fullImage: athletes.fullImage, // corpo inteiro
        historia: athletes.historia,
        faixa: athletes.faixa,
        escola: athletes.escola,
        nascimento: athletes.nascimento,
        cidade: athletes.cidade,
        bio: athletes.bio,
        evento: athletes.evento,
        ouro: athletes.ouro,
        prata: athletes.prata,
        bronze: athletes.bronze,

        // 🔹 Novos campos agregados de doações
        totalAmount: sql<number>`COALESCE(SUM(CAST(${donations.amount} AS DECIMAL)), 0)`,
        totalSupporters: sql<number>`COUNT(DISTINCT ${donations.donorUserId})`,
      })
      .from(athletes)
      .leftJoin(user, eq(athletes.userId, user.id))
      .leftJoin(donations, eq(donations.athleteId, athletes.id))
      .where(eq(athletes.userId, userId))
      .groupBy(
        athletes.id,
        athletes.userId,
        user.name,
        user.image,
        athletes.image,
        athletes.fullImage,
        athletes.faixa,
        athletes.escola,
        athletes.nascimento,
        athletes.cidade,
        athletes.bio,
        athletes.historia,
        athletes.evento,
        athletes.ouro,
        athletes.prata,
        athletes.bronze,
      )
      .limit(1);

    if (!result.length) {
      return { success: false, error: "Atleta não encontrado." };
    }

    const r = result[0];

    /** 🧠 Avatar com prioridade correta */
    const avatar =
      r.athleteImage && r.athleteImage.trim() !== ""
        ? r.athleteImage
        : r.userImage && r.userImage.trim() !== ""
          ? r.userImage
          : null;

    const athlete = {
      athleteId: r.athleteId,
      userId: r.userId,
      name: r.name || "Usuário",
      faixa: r.faixa,
      escola: r.escola,
      nascimento: r.nascimento,
      cidade: r.cidade,
      bio: r.bio,
      historia: r.historia,
      evento: r.evento,
      ouro: Number(r.ouro ?? 0),
      prata: Number(r.prata ?? 0),
      bronze: Number(r.bronze ?? 0),
      avatar,
      image: r.athleteImage,
      fullImage: r.fullImage,
      userImage: r.userImage,

      // ✅ Valores reais de doações
      totalAmount: Number(r.totalAmount ?? 0),
      totalSupporters: Number(r.totalSupporters ?? 0),
    };

    return { success: true, athlete };
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
    fullImage: string;
    historia: string;
    evento: string;
    ouro: string;
    prata: string;
    bronze: string;
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
        fullImage: data.fullImage ?? null,
        historia: data.historia ?? null,
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
 * Exclui completamente o atleta, a campanha, as doações e o próprio usuário.
 */
export async function deleteAthleteAccount(userId: string) {
  try {
    // 1. Verifica se existe atleta com esse userId
    const [ath] = await db
      .select({ athleteId: athletes.id })
      .from(athletes)
      .where(eq(athletes.userId, userId))
      .limit(1);

    // Se não existe atleta, ainda assim apagamos o usuário
    if (!ath) {
      await db.delete(user).where(eq(user.id, userId));
      return { success: true };
    }

    // 2. Apaga doações vinculadas a esse atleta
    await db.delete(donations).where(eq(donations.athleteId, ath.athleteId));

    // 3. Apaga campanhas do atleta
    await db.delete(campaigns).where(eq(campaigns.athleteId, ath.athleteId));

    // 4. Apaga o atleta
    await db.delete(athletes).where(eq(athletes.id, ath.athleteId));

    // 5. Apaga o próprio usuário (BetterAuth)
    await db.delete(user).where(eq(user.id, userId));

    return { success: true };
  } catch (error) {
    console.error("[deleteAthleteAccount] Erro ao excluir conta:", error);
    return { success: false, error: "Erro ao excluir conta." };
  }
}

/**
 * ✅ Retorna todos os atletas com seus dados de usuário
 */
export async function getAllAthletes() {
  try {
    const result = await db
      .select({
        // Dados do Atleta
        athleteId: athletes.id,
        userId: athletes.userId,
        name: user.name,
        userImage: user.image,
        athleteImage: athletes.image,
        fullImage: athletes.fullImage,
        faixa: athletes.faixa,
        escola: athletes.escola,
        nascimento: athletes.nascimento,
        cidade: athletes.cidade,
        bio: athletes.bio,
        evento: athletes.evento,
        ouro: athletes.ouro,
        prata: athletes.prata,
        bronze: athletes.bronze,

        // ✅ CAMPANHA (pode não existir ainda)
        campaignId: campaigns.id,

        // ✅ Doações reais
        totalAmount: sql<number>`COALESCE(SUM(${donations.amount}), 0)`,
        totalSupporters: sql<number>`COUNT(DISTINCT ${donations.donorUserId})`,
      })
      .from(athletes)
      .leftJoin(user, eq(athletes.userId, user.id))
      .leftJoin(campaigns, eq(campaigns.athleteId, athletes.id))
      .leftJoin(donations, eq(donations.athleteId, athletes.id)) // <--- JOIN com doações
      .groupBy(
        athletes.id,
        user.name,
        user.image,
        athletes.image,
        athletes.fullImage,
        athletes.faixa,
        athletes.escola,
        athletes.nascimento,
        athletes.cidade,
        athletes.bio,
        athletes.evento,
        athletes.ouro,
        athletes.prata,
        athletes.bronze,
        campaigns.id,
      );

    // ✅ Normalização do avatar
    const normalized = result.map((r) => ({
      ...r,
      avatar:
        r.athleteImage && r.athleteImage.trim() !== ""
          ? r.athleteImage
          : r.userImage && r.userImage.trim() !== ""
            ? r.userImage
            : null,
    }));

    return { success: true, data: normalized };
  } catch (error) {
    console.error("[getAllAthletes] Erro ao buscar atletas:", error);
    return { success: false, error: "Erro ao buscar atletas." };
  }
}
