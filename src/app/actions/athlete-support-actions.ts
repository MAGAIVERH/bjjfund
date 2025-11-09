"use server";

import { db } from "@/db";
import { athletes, user, donations } from "@/db/schema"; // ⬅️ adicione 'donations'
import { eq, sql } from "drizzle-orm"; // ⬅️ adicione 'sql'

export async function getAllAthletes() {
  try {
    const result = await db
      .select({
        athleteId: athletes.id,
        userId: athletes.userId,
        name: user.name,

        // imagens
        userImage: user.image,
        athleteImage: athletes.image,
        fullImage: athletes.fullImage,

        // outros campos
        faixa: athletes.faixa,
        escola: athletes.escola,
        cidade: athletes.cidade,
        nascimento: athletes.nascimento,
        bio: athletes.bio,
        historia: athletes.historia,
        evento: athletes.evento,
        ouro: athletes.ouro,
        prata: athletes.prata,
        bronze: athletes.bronze,

        // ⬇️ agregados de doações (por atleta)
        collectedAmount: sql<number>`
          COALESCE(SUM(CAST(${donations.amount} AS DECIMAL)), 0)
        `,
        supportersCount: sql<number>`
          COALESCE(COUNT(DISTINCT ${donations.donorUserId}), 0)
        `,
      })
      .from(athletes)
      .leftJoin(user, eq(athletes.userId, user.id))
      .leftJoin(donations, eq(donations.athleteId, athletes.id)) // ⬅️ liga doações ao atleta
      .groupBy(
        athletes.id,
        athletes.userId,
        user.name,
        user.image,
        athletes.image,
        athletes.fullImage,
        athletes.faixa,
        athletes.escola,
        athletes.cidade,
        athletes.nascimento,
        athletes.bio,
        athletes.historia,
        athletes.evento,
        athletes.ouro,
        athletes.prata,
        athletes.bronze,
      );

    const normalized = result.map((r) => ({
      athleteId: r.athleteId,
      userId: r.userId,
      name: r.name ?? "Atleta",
      faixa: r.faixa,
      escola: r.escola,
      cidade: r.cidade,
      nascimento: r.nascimento,
      bio: r.bio,
      historia: r.historia,
      evento: r.evento,
      ouro: Number(r.ouro ?? 0),
      prata: Number(r.prata ?? 0),
      bronze: Number(r.bronze ?? 0),

      // avatar com fallback
      avatar: r.athleteImage || r.fullImage || r.userImage || null,

      // brutos (compat)
      image: r.athleteImage,
      fullImage: r.fullImage,
      userImage: r.userImage,

      // ⬇️ aqui vão os números que o card exibe
      collectedAmount: Number(r.collectedAmount ?? 0),
      supportersCount: Number(r.supportersCount ?? 0),

      // aliases de compatibilidade, caso o componente use outros nomes
      totalAmount: Number(r.collectedAmount ?? 0),
      totalSupporters: Number(r.supportersCount ?? 0),
    }));

    return { success: true, athletes: normalized };
  } catch (error) {
    console.error("[getAllAthletes] Erro:", error);
    return { success: false, error: "Erro ao buscar atletas." };
  }
}
