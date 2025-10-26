"use server";

import { db } from "@/db";
import { athletes, user } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Busca todos os atletas cadastrados na plataforma,
 * incluindo as imagens de perfil do Google ou manuais,
 * e aplica fallback para garantir que sempre exista um avatar.
 */
export async function getAllAthletes() {
  try {
    const result = await db
      .select({
        athleteId: athletes.id,
        userId: athletes.userId,
        name: user.name,

        // ---- imagens ----
        userImage: user.image, // foto do Google (Better Auth)
        athleteImage: athletes.image, // foto de rosto (upload manual)
        fullImage: athletes.fullImage, // corpo inteiro (upload)

        // ---- outros campos ----
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
      })
      .from(athletes)
      .leftJoin(user, eq(athletes.userId, user.id));

    // Normaliza o retorno e aplica fallback de imagem
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

      // imagem final com fallback
      avatar:
        r.athleteImage || // upload de rosto
        r.fullImage || // corpo inteiro
        r.userImage || // foto do Google
        null,

      // campos brutos (para compatibilidade com AthleteSwitcherCard)
      image: r.athleteImage,
      fullImage: r.fullImage,
      userImage: r.userImage,
    }));

    return { success: true, athletes: normalized };
  } catch (error) {
    console.error("[getAllAthletes] Erro:", error);
    return { success: false, error: "Erro ao buscar atletas." };
  }
}
