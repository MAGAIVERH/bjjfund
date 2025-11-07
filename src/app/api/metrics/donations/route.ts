import { NextResponse } from "next/server";
import { db } from "@/db";
import { donations, campaigns, athletes } from "@/db/schema";
import { eq, or } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const period = (searchParams.get("period") || "mes") as
      | "dia"
      | "semana"
      | "mes"
      | "ano";
    const campaignId = searchParams.get("campaignId");
    const userId = searchParams.get("userId");
    const athleteIdParam = searchParams.get("athleteId");

    console.log("📊 [API MÉTRICAS] userId recebido:", userId);
    console.log("📊 [API MÉTRICAS] campaignId recebido:", campaignId);
    console.log("📊 [API MÉTRICAS] athleteId recebido:", athleteIdParam);

    // 🔹 1. Descobrir o athleteId (prioridade: direto > via userId)
    let athleteId: string | null = athleteIdParam ?? null;
    if (!athleteId && userId) {
      const foundAthlete = await db
        .select({ id: athletes.id })
        .from(athletes)
        .where(eq(athletes.userId, userId))
        .limit(1);

      athleteId = foundAthlete[0]?.id ?? null;
    }

    console.log("🎯 AthleteId final:", athleteId);

    // 🔹 2. Montar condição
    let whereCondition;
    if (campaignId) {
      whereCondition = eq(donations.campaignId, campaignId);
    } else if (athleteId) {
      whereCondition = or(
        eq(donations.athleteId, athleteId),
        eq(campaigns.athleteId, athleteId),
      );
    } else {
      console.warn("⚠️ Nenhum userId, athleteId ou campaignId fornecido.");
      return NextResponse.json({ data: [] });
    }

    // 🔹 3. Buscar doações
    const rows = await db
      .select({
        amount: donations.amount,
        createdAt: donations.createdAt,
        athleteId: donations.athleteId,
        campaignId: donations.campaignId,
      })
      .from(donations)
      .leftJoin(campaigns, eq(donations.campaignId, campaigns.id))
      .where(whereCondition);

    console.log("💰 Doações encontradas:", rows);

    // 🔹 4. Buckets
    const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
    const monthNames = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];
    const weekBuckets = ["Semana 1", "Semana 2", "Semana 3", "Semana 4"];

    let buckets = new Map<string, number>();
    if (period === "dia") weekDays.forEach((d) => buckets.set(d, 0));
    else if (period === "semana") weekBuckets.forEach((w) => buckets.set(w, 0));
    else if (period === "mes") monthNames.forEach((m) => buckets.set(m, 0));
    else buckets = new Map<string, number>();

    for (const row of rows) {
      if (!row.createdAt) continue;
      const d = new Date(row.createdAt as unknown as string | number | Date);
      const amount = Number(row.amount ?? 0) || 0;
      let key = "";

      switch (period) {
        case "dia": {
          const mapIdx = [6, 0, 1, 2, 3, 4, 5];
          key = weekDays[mapIdx[d.getDay()]] || "Seg";
          break;
        }
        case "semana": {
          const wk = Math.min(Math.max(Math.ceil(d.getDate() / 7), 1), 4);
          key = `Semana ${wk}`;
          break;
        }
        case "mes": {
          key = monthNames[d.getMonth()];
          break;
        }
        case "ano":
        default: {
          key = String(d.getFullYear());
          if (!buckets.has(key)) buckets.set(key, 0);
          break;
        }
      }

      buckets.set(key, (buckets.get(key) || 0) + amount);
    }

    // 🔹 5. Ordenar e retornar
    let orderedKeys: string[] = [];
    if (period === "dia") orderedKeys = weekDays;
    else if (period === "semana") orderedKeys = weekBuckets;
    else if (period === "mes") orderedKeys = monthNames;
    else
      orderedKeys = Array.from(buckets.keys()).sort(
        (a, b) => Number(a) - Number(b),
      );

    const data = orderedKeys.map((name) => ({
      name,
      amount: buckets.get(name) || 0,
    }));

    console.log("📈 Data final enviada ao gráfico:", data);

    return NextResponse.json({ data });
  } catch (err) {
    console.error("[api/metrics/donations] error:", err);
    return NextResponse.json(
      { error: "Erro ao gerar métricas" },
      { status: 500 },
    );
  }
}
