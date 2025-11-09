"use server";

import { db } from "@/db";
import { athletes, campaigns, user, donations } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

/**
 * Lista TODAS as campanhas com dados do atleta (nome, faixa, escola, avatar) e a imagem da campanha.
 */
export async function getAllCampaigns() {
  try {
    const rows = await db
      .select({
        id: campaigns.id,
        title: campaigns.title,
        description: campaigns.description,
        goalAmount: campaigns.goalAmount,
        // ignoramos o collectedAmount salvo no banco
        status: campaigns.status,
        startDate: campaigns.startDate,
        endDate: campaigns.endDate,
        campaignImage: campaigns.campaignImage,

        // atleta
        athleteId: athletes.id,
        athleteName: user.name,
        faixa: athletes.faixa,
        escola: athletes.escola,
        athleteAvatarManual: athletes.image,
        athleteAvatarGoogle: user.image,
      })
      .from(campaigns)
      .leftJoin(athletes, eq(campaigns.athleteId, athletes.id))
      .leftJoin(user, eq(athletes.userId, user.id));

    // ✅ Para cada campanha, somar DOAÇÕES reais
    const data = await Promise.all(
      rows.map(async (r) => {
        // Buscar total de doações da campanha
        const [donationStats] = await db
          .select({
            totalAmount: sql<number>`SUM(CAST(${donations.amount} AS DECIMAL))`,
            supportersCount: sql<number>`COUNT(DISTINCT ${donations.donorUserId})`,
          })
          .from(donations)
          .where(eq(donations.athleteId, r.athleteId || ""));

        // Avatar do atleta
        const athleteImage =
          (r.athleteAvatarManual && r.athleteAvatarManual.trim() !== ""
            ? r.athleteAvatarManual
            : r.athleteAvatarGoogle && r.athleteAvatarGoogle.trim() !== ""
              ? r.athleteAvatarGoogle
              : null) ?? null;

        return {
          id: r.id,
          title: r.title ?? "",
          description: r.description ?? "",
          goalAmount: Number(r.goalAmount ?? 0),
          collectedAmount: Number(donationStats?.totalAmount ?? 0), // ✅ valor correto
          supportersCount: Number(donationStats?.supportersCount ?? 0), // ✅ pode ser útil
          status: r.status ?? "active",
          startDate: r.startDate ?? null,
          endDate: r.endDate ?? null,

          // Imagens
          campaignImage: r.campaignImage ?? null,
          athleteImage,

          // Dados atleta
          athleteId: r.athleteId ?? "",
          athleteName: r.athleteName ?? "Atleta",
          faixa: r.faixa ?? "",
          escola: r.escola ?? "",
        };
      }),
    );

    return { success: true, data };
  } catch (error) {
    console.error("[getAllCampaigns] Erro:", error);
    return { success: false, error: "Erro ao buscar campanhas." };
  }
}

/**
 * Busca a campanha do atleta logado (inclui avatar com fallback, faixa, escola e campaignImage)
 */
export async function getCampaignByUserId(userId: string) {
  try {
    const [athlete] = await db
      .select({ id: athletes.id })
      .from(athletes)
      .where(eq(athletes.userId, userId))
      .limit(1);

    if (!athlete) {
      return { success: false, error: "Atleta não encontrado." };
    }

    const rows = await db
      .select({
        // campanha
        id: campaigns.id,
        title: campaigns.title,
        description: campaigns.description,
        goalAmount: campaigns.goalAmount,
        collectedAmount: campaigns.collectedAmount,
        status: campaigns.status,
        campaignImage: campaigns.campaignImage,

        // atleta
        athleteId: campaigns.athleteId,
        athleteName: user.name,
        faixa: athletes.faixa,
        escola: athletes.escola,
        athleteAvatarManual: athletes.image,
        athleteAvatarGoogle: user.image,
      })
      .from(campaigns)
      .leftJoin(athletes, eq(campaigns.athleteId, athletes.id))
      .leftJoin(user, eq(athletes.userId, user.id))
      .where(eq(campaigns.athleteId, athlete.id))
      .limit(1);

    if (!rows.length) {
      return { success: false, error: "Nenhuma campanha ativa encontrada." };
    }

    // ✅ 🔽 ADICIONE AQUI (cálculo dos valores reais do banco)
    const [donationStats] = await db
      .select({
        totalAmount: sql<number>`SUM(CAST(${donations.amount} AS DECIMAL))`,
        supportersCount: sql<number>`COUNT(DISTINCT ${donations.donorUserId})`,
      })
      .from(donations)
      .where(eq(donations.athleteId, athlete.id));
    console.log("💰 donationStats =>", donationStats);
    console.log("👤 athlete.id =>", athlete.id);

    const c = rows[0];
    const athleteImage =
      (c.athleteAvatarManual && c.athleteAvatarManual.trim() !== ""
        ? c.athleteAvatarManual
        : c.athleteAvatarGoogle && c.athleteAvatarGoogle.trim() !== ""
          ? c.athleteAvatarGoogle
          : null) ?? null;

    const data = {
      id: c.id,
      title: c.title ?? "",
      description: c.description ?? "",
      goalAmount: String(c.goalAmount ?? "0"),

      status: c.status ?? "active",
      athleteId: c.athleteId ?? "",
      collectedAmount: Number(donationStats?.totalAmount ?? 0),
      supportersCount: Number(donationStats?.supportersCount ?? 0),

      // imagens
      campaignImage: c.campaignImage || null,
      athleteImage, // ✅ mantém compat com os componentes

      // atleta
      athleteName: c.athleteName ?? "Atleta",
      faixa: c.faixa ?? "",
      escola: c.escola ?? "",
    };

    return { success: true, data };
  } catch (error) {
    console.error("[getCampaignByUserId] Erro:", error);
    return { success: false, error: "Erro ao buscar campanha do atleta." };
  }
}

/**
 * Cria campanha PARA o atleta logado
 */
export async function createCampaign(input: {
  userId: string;
  title: string;
  description: string;
  goalAmount: number;
  campaignImage?: string; // opcional
  startDate?: Date | null;
  endDate?: Date | null;
}) {
  try {
    const ath = await db
      .select({ id: athletes.id })
      .from(athletes)
      .where(eq(athletes.userId, input.userId))
      .limit(1);

    if (!ath.length) {
      return { success: false, error: "Perfil de atleta não encontrado." };
    }

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
      campaignImage: input.campaignImage ?? null,
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

/**
 * Atualiza campanha do atleta logado.
 * Mantém compatibilidade: `campaignImage` é opcional.
 */
export async function updateCampaign(input: {
  campaignId: string;
  userId: string;
  title: string;
  description: string;
  goalAmount: number;
  campaignImage?: string; // opcional: só atualiza se vier
}) {
  try {
    const [ath] = await db
      .select({ id: athletes.id })
      .from(athletes)
      .where(eq(athletes.userId, input.userId))
      .limit(1);

    if (!ath) return { success: false, error: "Atleta não encontrado." };

    const patch: Partial<typeof campaigns.$inferInsert> = {
      title: input.title,
      description: input.description,
      goalAmount: String(input.goalAmount),
      updatedAt: new Date(),
    };

    if (typeof input.campaignImage !== "undefined") {
      patch.campaignImage = input.campaignImage || null;
    }

    await db
      .update(campaigns)
      .set(patch)
      .where(
        and(
          eq(campaigns.id, input.campaignId),
          eq(campaigns.athleteId, ath.id),
        ),
      );

    return { success: true };
  } catch (error) {
    console.error("[updateCampaign] Erro:", error);
    return { success: false, error: "Erro ao atualizar campanha." };
  }
}

/**
 * Deleta campanha do atleta logado
 */
export async function deleteCampaign(campaignId: string, userId: string) {
  try {
    const [ath] = await db
      .select({ id: athletes.id })
      .from(athletes)
      .where(eq(athletes.userId, userId))
      .limit(1);

    if (!ath) return { success: false, error: "Atleta não encontrado." };

    await db
      .delete(campaigns)
      .where(
        and(eq(campaigns.id, campaignId), eq(campaigns.athleteId, ath.id)),
      );

    return { success: true };
  } catch (error) {
    console.error("[deleteCampaign] Erro:", error);
    return { success: false, error: "Erro ao excluir campanha." };
  }
}
