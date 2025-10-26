"use server";

import Stripe from "stripe";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

// ✅ Instância Stripe (sem apiVersion)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createCheckoutSession(
  athleteId: string,
  athleteName: string,
  amount: number,
) {
  // 🔑 Obtém o usuário logado
  const session = await auth.api.getSession({
    headers: new Headers(),
  });

  const donorUserId = session?.user?.id ?? "anonymous";

  // 💳 Cria a sessão de pagamento no Stripe
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    metadata: {
      donorUserId,
      athleteId,
      athleteName,
    },
    line_items: [
      {
        price_data: {
          currency: "brl",
          product_data: { name: `Doação para ${athleteName}` },
          unit_amount: amount * 100, // valor em centavos
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?athleteId=${athleteId}&athleteName=${encodeURIComponent(
      athleteName,
    )}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dash-donors`,
  });

  // 🔁 Redireciona automaticamente para o checkout do Stripe
  redirect(checkoutSession.url!);
}
