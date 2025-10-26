"use server";

import { db } from "@/db";
import { athletes, campaigns, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

/**
 * Lista TODAS as campanhas com dados do atleta (nome e foto)
 */
export async function getAllCampaigns() {
  try {
    const rows = await db
      .select({
        id: campaigns.id,
        title: campaigns.title,
        description: campaigns.description,
        goalAmount: campaigns.goalAmount,
        collectedAmount: campaigns.collectedAmount,
        status: campaigns.status,
        startDate: campaigns.startDate,
        endDate: campaigns.endDate,
        athleteId: athletes.id,
        athleteFullImage: athletes.fullImage,
        athleteUserName: user.name,
      })
      .from(campaigns)
      .leftJoin(athletes, eq(campaigns.athleteId, athletes.id))
      .leftJoin(user, eq(athletes.userId, user.id));

    const data = rows.map((r) => ({
      id: r.id,
      title: r.title ?? "",
      description: r.description ?? "",
      goalAmount: Number(r.goalAmount ?? 0),
      collectedAmount: Number(r.collectedAmount ?? 0),
      status: r.status ?? "active",
      startDate: r.startDate ?? null,
      endDate: r.endDate ?? null,
      athleteId: r.athleteId ?? "",
      athleteName: r.athleteUserName ?? "Atleta",
      athleteImage: r.athleteFullImage ?? null,
    }));

    return { success: true, data };
  } catch (error) {
    console.error("[getAllCampaigns] Erro:", error);
    return { success: false, error: "Erro ao buscar campanhas." };
  }
}

/**
 * Cria campanha PARA o atleta logado.
 * Agora impede criar mais de uma ativa.
 */
export async function createCampaign(input: {
  userId: string;
  title: string;
  description: string;
  goalAmount: number;
  startDate?: Date | null;
  endDate?: Date | null;
}) {
  try {
    // acha o athleteId pelo userId
    const ath = await db
      .select({ id: athletes.id })
      .from(athletes)
      .where(eq(athletes.userId, input.userId))
      .limit(1);

    if (!ath.length) {
      return { success: false, error: "Perfil de atleta não encontrado." };
    }

    // impede criar mais de uma campanha ativa
    const existing = await db
      .select({ id: campaigns.id })
      .from(campaigns)
      .where(eq(campaigns.athleteId, ath[0].id))
      .limit(1);

    if (existing.length > 0) {
      return { success: false, error: "Você já possui uma campanha ativa." };
    }

    const campaignId = randomUUID();

    await db.insert(campaigns).values({
      id: campaignId,
      athleteId: ath[0].id,
      title: input.title,
      description: input.description,
      goalAmount: String(input.goalAmount),
      collectedAmount: "0",
      startDate: input.startDate ?? new Date(),
      endDate: input.endDate ?? null,
      status: "active",
      updatedAt: new Date(),
    });

    return { success: true, id: campaignId };
  } catch (error) {
    console.error("[createCampaign] Erro:", error);
    return { success: false, error: "Erro ao criar campanha." };
  }
}
