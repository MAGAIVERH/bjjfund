"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, MapPin, Cake, Medal, Quote } from "lucide-react";

interface AthleteProfileCardProps {
  name: string;
  avatar?: string | null;
  faixa?: string;
  escola?: string;
  nascimento?: string;
  cidade?: string;
  bio?: string;
  evento?: string;
  ouro?: number;
  prata?: number;
  bronze?: number;
}

export function AthleteProfileCard({
  name,
  avatar,
  faixa,
  escola,
  nascimento,
  cidade,
  bio,
  evento,
  ouro = 0,
  prata = 0,
  bronze = 0,
}: AthleteProfileCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Evita renderização no SSR

  return (
    <Card className="hover:border-primary/20 border-2 transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-8">
        {/* Quote / Bio */}
        <div className="mb-6">
          <Quote className="text-primary mb-4 h-8 w-8" />
          <p className="line-clamp-3 overflow-hidden text-lg leading-relaxed text-balance break-words italic">
            {bio || "Nenhuma frase cadastrada"}
          </p>
        </div>

        {/* Athlete Info */}
        <div className="mb-6 flex items-center gap-4">
          <Avatar className="h-16 w-16">
            {avatar ? (
              <AvatarImage src={avatar} />
            ) : (
              <AvatarFallback>{(name || "U")[0]}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <h4 className="text-lg font-bold">{name || "Usuário"}</h4>
            <p className="text-muted-foreground">
              {faixa || "Faixa não cadastrada"} •{" "}
              {escola || "Escola não cadastrada"}
            </p>
          </div>
        </div>

        {/* Achievement / Location / Event */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-2">
            <Trophy className="text-primary h-5 w-5" />
            <span className="font-semibold">
              {evento || "Evento não cadastrado"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="text-muted-foreground h-5 w-5" />
            <span className="text-muted-foreground">
              {cidade || "Cidade não cadastrada"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Cake className="text-muted-foreground h-5 w-5" />
            <span className="text-muted-foreground">
              {nascimento || "Não cadastrada"}
            </span>
          </div>
        </div>

        {/* Medalhas */}
        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <div className="flex flex-col items-center gap-1">
            <span className="h-6 w-6">🥇</span>
            <span className="text-2xl font-bold">{ouro ?? 0}</span>
            <span className="text-muted-foreground text-sm">Ouro</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="h-6 w-6">🥈</span>
            <span className="text-2xl font-bold">{prata ?? 0}</span>
            <span className="text-muted-foreground text-sm">Prata</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="h-6 w-6">🥉</span>
            <span className="text-2xl font-bold">{bronze ?? 0}</span>
            <span className="text-muted-foreground text-sm">Bronze</span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-6">
          <div className="text-center">
            <div className="text-primary text-2xl font-bold">R$ 18.500</div>
            <div className="text-muted-foreground text-sm">Arrecadado</div>
          </div>
          <div className="text-center">
            <div className="text-primary text-2xl font-bold">127</div>
            <div className="text-muted-foreground text-sm">Apoiadores</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AthleteProfileCard;
