// "use server";

// import { db } from "@/db";
// import { athletes, user } from "@/db/schema";
// import { eq } from "drizzle-orm";
// import { randomUUID } from "crypto";

// /**
//  * Cria um novo atleta vinculado a um usuário
//  */
// export async function createAthlete(data: {
//   userId: string;
//   faixa: string;
//   escola: string;
//   nascimento: string;
//   cidade: string;
//   bio?: string;
//   image?: string; // rosto
//   fullImage?: string; // corpo inteiro
//   historia?: string; // história
//   evento?: string;
//   ouro?: string;
//   prata?: string;
//   bronze?: string;
// }) {
//   try {
//     const id = randomUUID();

//     await db.insert(athletes).values({
//       id,
//       userId: data.userId,
//       faixa: data.faixa,
//       escola: data.escola,
//       nascimento: data.nascimento,
//       cidade: data.cidade,
//       bio: data.bio || null,
//       image: data.image ?? null,
//       fullImage: data.fullImage ?? null,
//       historia: data.historia ?? null,
//       evento: data.evento || null,
//       ouro: data.ouro || "0",
//       prata: data.prata || "0",
//       bronze: data.bronze || "0",
//     });

//     return { success: true, id };
//   } catch (error) {
//     console.error("[createAthlete] Erro ao criar atleta:", error);
//     return { success: false, error: "Erro ao criar atleta." };
//   }
// }

// /**
//  * ✅ Obtém informações completas do atleta pelo userId (com nome e imagem do Google)
//  */
// export async function getAthleteByUserId(userId: string) {
//   try {
//     const result = await db
//       .select({
//         athleteId: athletes.id,
//         userId: athletes.userId,
//         name: user.name, // nome vindo do Google
//         userImage: user.image, // imagem do Google
//         athleteImage: athletes.image,
//         fullImage: athletes.fullImage,
//         historia: athletes.historia,
//         faixa: athletes.faixa,
//         escola: athletes.escola,
//         nascimento: athletes.nascimento,
//         cidade: athletes.cidade,
//         bio: athletes.bio,
//         evento: athletes.evento,
//         ouro: athletes.ouro,
//         prata: athletes.prata,
//         bronze: athletes.bronze,
//       })
//       .from(athletes)
//       .leftJoin(user, eq(athletes.userId, user.id))
//       .where(eq(athletes.userId, userId))
//       .limit(1);

//     if (!result || result.length === 0) {
//       return { success: false, error: "Atleta não encontrado." };
//     }

//     const r = result[0];

//     const athlete = {
//       athleteId: r.athleteId,
//       userId: r.userId,
//       name: r.name || "Usuário",
//       faixa: r.faixa,
//       escola: r.escola,
//       nascimento: r.nascimento,
//       historia: r.historia,
//       cidade: r.cidade,
//       bio: r.bio,
//       evento: r.evento,
//       ouro: r.ouro ?? "0",
//       prata: r.prata ?? "0",
//       bronze: r.bronze ?? "0",
//       avatar: r.athleteImage || r.fullImage || r.userImage || null,
//       image: r.athleteImage,
//       fullImage: r.fullImage,
//       userImage: r.userImage,
//     };

//     return { success: true, athlete };
//   } catch (error) {
//     console.error("[getAthleteByUserId] Erro ao buscar atleta:", error);
//     return { success: false, error: "Erro ao buscar atleta." };
//   }
// }

// /**
//  * Atualiza informações do atleta
//  */
// export async function updateAthlete(
//   userId: string,
//   data: Partial<{
//     faixa: string;
//     escola: string;
//     nascimento: string;
//     cidade: string;
//     bio: string;
//     image: string;
//     fullImage: string;
//     historia: string;
//     evento: string;
//     ouro: string;
//     prata: string;
//     bronze: string;
//   }>,
// ) {
//   try {
//     await db
//       .update(athletes)
//       .set({
//         faixa: data.faixa,
//         escola: data.escola,
//         nascimento: data.nascimento,
//         cidade: data.cidade,
//         bio: data.bio,
//         image: data.image,
//         fullImage: data.fullImage ?? null,
//         historia: data.historia ?? null,
//         evento: data.evento,
//         ouro: data.ouro,
//         prata: data.prata,
//         bronze: data.bronze,
//       })
//       .where(eq(athletes.userId, userId));

//     return { success: true };
//   } catch (error) {
//     console.error("[updateAthlete] Erro ao atualizar atleta:", error);
//     return { success: false, error: "Erro ao atualizar atleta." };
//   }
// }

// /**
//  * Deleta um atleta pelo userId
//  */
// export async function deleteAthlete(userId: string) {
//   try {
//     await db.delete(athletes).where(eq(athletes.userId, userId));
//     return { success: true };
//   } catch (error) {
//     console.error("[deleteAthlete] Erro ao deletar atleta:", error);
//     return { success: false, error: "Erro ao deletar atleta." };
//   }
// }

// /**
//  * ✅ Retorna todos os atletas com seus dados de usuário
//  */
// export async function getAllAthletes() {
//   try {
//     const result = await db
//       .select({
//         athleteId: athletes.id,
//         userId: athletes.userId,
//         name: user.name,
//         userImage: user.image,
//         athleteImage: athletes.image,
//         fullImage: athletes.fullImage,
//         faixa: athletes.faixa,
//         escola: athletes.escola,
//         nascimento: athletes.nascimento,
//         cidade: athletes.cidade,
//         bio: athletes.bio,
//         historia: athletes.historia,
//         evento: athletes.evento,
//         ouro: athletes.ouro,
//         prata: athletes.prata,
//         bronze: athletes.bronze,
//       })
//       .from(athletes)
//       .leftJoin(user, eq(athletes.userId, user.id));

//     const normalized = result.map((r) => ({
//       ...r,
//       avatar: r.athleteImage || r.fullImage || r.userImage || null,
//     }));

//     return { success: true, data: normalized };
//   } catch (error) {
//     console.error("[getAllAthletes] Erro ao buscar atletas:", error);
//     return { success: false, error: "Erro ao buscar atletas." };
//   }
// }

"use server";

import { db } from "@/db";
import { athletes, user } from "@/db/schema";
import { eq } from "drizzle-orm";
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
 * ✅ Obtém informações completas do atleta pelo userId (com nome e imagem do Google)
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
        historia: athletes.historia, // ✅ agora incluída
        faixa: athletes.faixa,
        escola: athletes.escola,
        nascimento: athletes.nascimento,
        cidade: athletes.cidade,
        bio: athletes.bio,
        evento: athletes.evento,
        ouro: athletes.ouro,
        prata: athletes.prata,
        bronze: athletes.bronze,
      })
      .from(athletes)
      .leftJoin(user, eq(athletes.userId, user.id))
      .where(eq(athletes.userId, userId))
      .limit(1);

    if (!result || result.length === 0) {
      return { success: false, error: "Atleta não encontrado." };
    }

    const r = result[0];

    /** 🧠 CORREÇÃO — Prioridade correta do avatar */
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
      ouro: r.ouro ?? "0",
      prata: r.prata ?? "0",
      bronze: r.bronze ?? "0",
      avatar, // ✅ avatar separado da fullImage
      image: r.athleteImage,
      fullImage: r.fullImage,
      userImage: r.userImage,
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

/**
 * ✅ Retorna todos os atletas com seus dados de usuário
 */
export async function getAllAthletes() {
  try {
    const result = await db
      .select({
        athleteId: athletes.id,
        userId: athletes.userId,
        name: user.name,
        userImage: user.image,
        athleteImage: athletes.image,
        fullImage: athletes.fullImage,
        historia: athletes.historia, // ✅ incluída também
        faixa: athletes.faixa,
        escola: athletes.escola,
        nascimento: athletes.nascimento,
        cidade: athletes.cidade,
        bio: athletes.bio,
        evento: athletes.evento,
        ouro: athletes.ouro,
        prata: athletes.prata,
        bronze: athletes.bronze,
      })
      .from(athletes)
      .leftJoin(user, eq(athletes.userId, user.id));

    /** 🧠 CORREÇÃO — Prioridade certa no avatar */
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
