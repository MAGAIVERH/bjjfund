"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, MapPin, Cake, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

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
  totalAmount?: number;
  totalSupporters?: number;
  className?: string;
  showDonateCta?: boolean;
  onDonate?: () => void;
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
  totalAmount,
  totalSupporters,
  ouro = 0,
  prata = 0,
  bronze = 0,
  className,
  showDonateCta = false,
  onDonate,
}: AthleteProfileCardProps) {
  const [mounted, setMounted] = useState(false);
  const [validImage, setValidImage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    // 🔍 Verifica se o avatar é realmente válido (URL existente e não vazia)
    if (
      avatar &&
      avatar !== "null" &&
      avatar !== "undefined" &&
      avatar.trim() !== ""
    ) {
      setValidImage(avatar);
    } else {
      setValidImage(null);
    }
  }, [avatar]);

  if (!mounted) return null;

  return (
    <Card
      className={clsx(
        "hover:border-primary/20 border-2 transition-all duration-300 hover:shadow-lg",
        className,
      )}
    >
      <CardContent className="flex h-full flex-col justify-between p-8">
        {/* PARTE SUPERIOR */}
        <div className="space-y-6">
          {/* Bio */}
          <div>
            <Quote className="text-primary mb-3 h-6 w-6" />
            <p
              className="line-clamp-2 text-lg leading-relaxed text-gray-700 italic"
              style={{ wordBreak: "break-word", maxWidth: "100%" }}
            >
              {bio || "Nenhuma frase cadastrada"}
            </p>
          </div>

          {/* Info principal */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border border-gray-200 bg-gray-100">
              {validImage ? (
                <AvatarImage
                  src={validImage}
                  alt={name || "Avatar"}
                  onError={() => setValidImage(null)}
                  className="rounded-full object-cover"
                />
              ) : (
                <AvatarFallback className="bg-gray-200 font-semibold text-gray-700">
                  {(name || "U")[0].toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>

            <div>
              <h4 className="text-base font-semibold text-gray-900">
                {name || "Usuário"}
              </h4>
              <p className="text-muted-foreground text-sm">
                {faixa || "Faixa não cadastrada"} •{" "}
                {escola || "Escola não cadastrada"}
              </p>
            </div>
          </div>

          {/* Evento, cidade e nascimento */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Trophy className="text-primary h-5 w-5" />
              <span className="font-medium text-gray-900">
                {evento || "Evento não cadastrado"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              {cidade || "Cidade não cadastrada"}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Cake className="h-4 w-4" />
              {nascimento || "Não cadastrada"}
            </div>
          </div>
        </div>

        {/* SEÇÃO INFERIOR */}
        <div className="mt-8 border-t pt-6">
          <div className="mb-6 flex justify-around text-center">
            <div>
              <span className="text-sm text-gray-500">🥇 Ouro</span>
              <span className="block text-2xl font-bold text-gray-900">
                {ouro}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">🥈 Prata</span>
              <span className="block text-2xl font-bold text-gray-900">
                {prata}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">🥉 Bronze</span>
              <span className="block text-2xl font-bold text-gray-900">
                {bronze}
              </span>
            </div>
          </div>

          <div className="my-4 border-t" />

          <div className="grid grid-cols-2 text-center">
            <div>
              <div className="text-2xl font-bold text-red-700">
                {totalAmount
                  ? `R$ ${totalAmount.toLocaleString("pt-BR")}`
                  : "R$ 0"}
              </div>
              <div className="text-sm text-gray-600">Arrecadado</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-700">
                {totalSupporters ?? 0}
              </div>
              <div className="text-sm text-gray-600">Apoiadores</div>
            </div>
          </div>

          {showDonateCta && (
            <Button
              className="bg-primary hover:bg-primary/90 mt-8 w-full rounded-xl py-2 font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                onDonate?.();
              }}
            >
              ❤️ Doar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default AthleteProfileCard;
