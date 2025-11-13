// ✅ Execução no ambiente Node (necessário para Stripe Webhook)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db";
import { donations } from "@/db/schema";

// ✅ Stripe sem API version forçada (usa a do seu projeto)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// ✅ Desabilitar body parsing automático do Next (IMPORTANTE!)
export const config = {
  api: { bodyParser: false },
};

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  if (!sig || !rawBody) {
    console.error("❌ Webhook sem assinatura ou corpo vazio");
    return new NextResponse("Invalid webhook", { status: 400 });
  }

  try {
    // ✅ Monta o evento Stripe com segurança
    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    console.log("🔔 Stripe Webhook recebido:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // ✅ Proteção: evitar processar doações sem metadata (ex: Stripe CLI)
      if (
        !session.metadata ||
        !session.metadata.donorUserId ||
        !session.metadata.athleteId
      ) {
        console.warn("⚠️ Metadata ausente ou incompleta. Ignorando evento.");
        return NextResponse.json({ received: true });
      }

      const donorUserId = session.metadata.donorUserId;
      const athleteId = session.metadata.athleteId;
      const campaignIdRaw = session.metadata.campaignId ?? null;

      // ✅ Doação pode ser COM OU SEM campanha
      const campaignId =
        campaignIdRaw && campaignIdRaw !== "null" && campaignIdRaw.trim() !== ""
          ? campaignIdRaw
          : null;

      const paymentIntentId = String(session.payment_intent ?? "");
      const amountNumber = (session.amount_total ?? 0) / 100;

      // ✅ Evitar salvar duas vezes a mesma doação
      const existing = await db
        .select()
        .from(donations)
        .where(eq(donations.paymentProviderId, paymentIntentId));

      if (existing.length > 0) {
        console.log(
          "⚠️ Doação já registrada anteriormente. Ignorando duplicata.",
        );
        return NextResponse.json({ received: true });
      }

      console.log("💾 Salvando doação:", {
        donorUserId,
        athleteId,
        campaignId,
        amountNumber,
      });

      // ✅ Salvar no banco
      await db.insert(donations).values({
        id: randomUUID(),
        donorUserId,
        athleteId,
        campaignId,
        amount: amountNumber.toFixed(2),
        currency: "BRL",
        status: "confirmed",
        paymentProvider: "stripe",
        paymentProviderId: paymentIntentId,
        createdAt: new Date(),
        confirmedAt: new Date(),
        metadata: { stripeSessionId: session.id },
      });

      console.log("✅ Doação salva com sucesso no banco!");
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("❌ Erro ao processar webhook Stripe:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
