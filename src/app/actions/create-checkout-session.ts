"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Stripe from "stripe";

import { auth } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createCheckoutSession(
  athleteId: string,
  athleteName: string,
  amount: number,
  campaignId?: string | null,
) {
  // ✅ Pega headers reais (Promise)
  const h = await headers();

  // ✅ Sessão autenticada (Better Auth)
  const session = await auth.api.getSession({ headers: h });

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado. Faça login antes de doar.");
  }

  const donorUserId = session.user.id;

  // 🔍 Log de debug completo
  console.log("🧾 Criando checkout para:", {
    donorUserId,
    athleteId,
    athleteName,
    campaignId,
    amount,
  });

  // 💳 Criação da sessão Stripe
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],

    // ✅ Incluímos SEMPRE o campaignId — se vier null, ainda vai como string vazia
    metadata: {
      donorUserId,
      athleteId,
      athleteName,
      campaignId: campaignId || "",
    },

    line_items: [
      {
        price_data: {
          currency: "brl",
          product_data: { name: `Doação para ${athleteName}` },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],

    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?athleteId=${athleteId}&athleteName=${encodeURIComponent(
      athleteName,
    )}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dash-donors`,
  });

  console.log("✅ Sessão Stripe criada:", checkoutSession.id);
  console.log("✅ Metadata enviada:", checkoutSession.metadata);

  // 🔁 Redireciona o usuário para o Stripe Checkout
  redirect(checkoutSession.url!);
}
