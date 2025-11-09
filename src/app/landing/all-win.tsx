"use client";

import { Heart, HandHeart, Sprout, ArrowRight, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AllWinSection() {
  return (
    <section
      id="todos-ganham"
      className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-gray-50 py-24"
    >
      {/* Fundo com bolhas animadas */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="bg-primary animate-float absolute top-20 left-10 h-32 w-32 rounded-full"></div>
        <div
          className="bg-accent animate-float absolute top-40 right-20 h-24 w-24 rounded-full"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="bg-primary animate-float /* posição melhor no mobile */ /* comportamento original no desktop */ absolute bottom-30 left-4 h-20 w-20 rounded-full md:bottom-32 md:left-1/4"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto max-w-4xl px-6 text-center">
        {/* Ícone principal */}
        <div className="bg-primary/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
          <HandHeart className="text-primary h-10 w-10" />
        </div>

        {/* Título */}
        <h2 className="mb-6 text-3xl font-bold md:text-5xl">
          Sua doação não é apenas dinheiro.
          <span className="text-primary"> É chance, é futuro, é vitória.</span>
        </h2>

        {/* Texto introdutório */}
        <p className="text-muted-foreground mx-auto mb-12 max-w-3xl text-lg leading-relaxed">
          No Brasil, milhares de atletas talentosos desistem do sonho por falta
          de apoio financeiro. Viagens, inscrições, alimentação adequada, exames
          médicos e equipamentos: tudo isso tem custo — e muitos não conseguem
          bancar.
        </p>

        {/* Bloco emocional */}
        <div className="mx-auto mb-16 max-w-3xl rounded-xl bg-white/60 p-6 shadow-lg backdrop-blur">
          <p className="text-lg leading-relaxed">
            <span className="inline-flex items-center gap-2 font-semibold">
              <Brain className="text-primary h-5 w-5" />
              Apoiar um atleta é investir em histórias reais.
            </span>
            <br />
            Você está ajudando a construir jornadas de disciplina, superação e
            esperança.
          </p>
        </div>

        {/* Benefício fiscal */}
        <div className="border-primary/30 bg-primary/5 mx-auto mb-16 max-w-3xl rounded-xl border p-6 text-left shadow-sm">
          <h3 className="text-primary mb-2 flex items-center gap-2 text-xl font-bold">
            📌 Benefício Fiscal: Doar e Abater no Imposto de Renda?
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Sim! O governo brasileiro permite reduzir parte do Imposto de Renda
            por doações feitas a projetos esportivos aprovados pela{" "}
            <strong>Lei de Incentivo ao Esporte</strong>.
            <br />
            <br />
            Nosso projeto está em fase de estruturação para obter essa
            certificação. Em breve você poderá apoiar atletas e ainda ter esse
            benefício legal.
          </p>
        </div>

        {/* Por que apoiar agora */}
        <div className="mb-12 space-y-6">
          <h3 className="text-center text-2xl font-bold">
            Por que apoiar agora?
          </h3>

          <ul className="text-muted-foreground mx-auto flex max-w-xl flex-col gap-4 text-lg">
            <li className="flex items-start gap-2">
              <span className="text-green-500">✅</span>
              <span>
                Porque cada contribuição transforma treinos em conquistas.
              </span>
            </li>

            <li className="flex items-start gap-2">
              <span className="text-green-500">✅</span>
              <span>
                {" "}
                Porque o esporte muda vidas e inspira novas gerações.
              </span>
            </li>

            <li className="flex items-start gap-2">
              <span className="text-green-500">✅</span>
              <span>
                O maior retorno é saber que você fez parte dessa vitória.
              </span>
            </li>
          </ul>
        </div>

        {/* Botão CTA */}
        <Button asChild size="lg" className="px-10 py-6 text-lg font-semibold">
          <Link href="/authentication">
            Quero Apoiar
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
