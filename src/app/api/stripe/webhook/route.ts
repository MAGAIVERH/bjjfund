export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db";
import { donations } from "@/db/schema";
import { eq } from "drizzle-orm";

// ✅ sem apiVersion (erro corrigido)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  try {
    // ✅ constrói o evento com a assinatura correta
    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    // 🎯 evento principal: pagamento concluído
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const donorUserId = session.metadata?.donorUserId ?? null;
      const athleteId = session.metadata?.athleteId ?? null;

      // Stripe envia em centavos → converter para reais
      const amountNumber = (session.amount_total ?? 0) / 100;
      const amountAsString = amountNumber.toFixed(2); // ✅ Drizzle numeric = string

      const paymentIntentId = String(session.payment_intent ?? "");

      // 🔍 evita duplicar doação
      const existing = await db
        .select()
        .from(donations)
        .where(eq(donations.paymentProviderId, paymentIntentId));

      if (existing.length === 0) {
        await db.insert(donations).values({
          id: crypto.randomUUID(),
          donorUserId,
          campaignId: null, // se ainda não estiver usando campanhas
          athleteId,
          amount: amountAsString, // ✅ string
          currency: "BRL",
          status: "confirmed",
          paymentProvider: "stripe",
          paymentProviderId: paymentIntentId,
          confirmedAt: new Date(),
          metadata: { stripeSessionId: session.id },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("❌ Erro no webhook Stripe:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
