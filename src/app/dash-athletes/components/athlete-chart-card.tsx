"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface AthleteChartCardProps {
  campaignId?: string;
  userId?: string;
  athleteId?: string; // ✅ novo
}

type FilterOption = "dia" | "semana" | "mes" | "ano";
type Point = { name: string; amount: number };

const EMPTY_SERIES: Record<FilterOption, Point[]> = {
  dia: [
    { name: "Seg", amount: 0 },
    { name: "Ter", amount: 0 },
    { name: "Qua", amount: 0 },
    { name: "Qui", amount: 0 },
    { name: "Sex", amount: 0 },
    { name: "Sáb", amount: 0 },
    { name: "Dom", amount: 0 },
  ],
  semana: [
    { name: "Semana 1", amount: 0 },
    { name: "Semana 2", amount: 0 },
    { name: "Semana 3", amount: 0 },
    { name: "Semana 4", amount: 0 },
  ],
  mes: [
    { name: "Jan", amount: 0 },
    { name: "Fev", amount: 0 },
    { name: "Mar", amount: 0 },
    { name: "Abr", amount: 0 },
    { name: "Mai", amount: 0 },
    { name: "Jun", amount: 0 },
    { name: "Jul", amount: 0 },
    { name: "Ago", amount: 0 },
    { name: "Set", amount: 0 },
    { name: "Out", amount: 0 },
    { name: "Nov", amount: 0 },
    { name: "Dez", amount: 0 },
  ],
  ano: [
    { name: "2021", amount: 0 },
    { name: "2022", amount: 0 },
    { name: "2023", amount: 0 },
    { name: "2024", amount: 0 },
  ],
};

export function AthleteChartCard({
  campaignId,
  userId,
  athleteId,
}: AthleteChartCardProps) {
  const [filter, setFilter] = useState<FilterOption>("mes");
  const [series, setSeries] = useState<Point[]>(EMPTY_SERIES["mes"]);
  const [loading, setLoading] = useState(false);

  const query = useMemo(() => {
    const p = new URLSearchParams();
    p.set("period", filter);
    if (athleteId) p.set("athleteId", athleteId);
    else if (userId) p.set("userId", userId);
    else if (campaignId) p.set("campaignId", campaignId);
    return p.toString();
  }, [filter, campaignId, userId, athleteId]);

  const REFRESH_INTERVAL = 10000;

  useEffect(() => {
    let mounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    async function load() {
      setLoading(true);
      if (mounted) setSeries(EMPTY_SERIES[filter]);

      try {
        const res = await fetch(`/api/metrics/donations?${query}`, {
          method: "GET",
          cache: "no-store",
        });
        if (!res.ok) throw new Error("endpoint indisponível");

        const payload = await res.json();
        const rows: Point[] =
          Array.isArray(payload?.data) && payload.data.length
            ? payload.data.map((d: any) => ({
                name: String(d.name ?? d.label ?? ""),
                amount: Number(d.amount ?? d.value ?? 0),
              }))
            : [];

        if (mounted) setSeries(rows.length ? rows : EMPTY_SERIES[filter]);
      } catch {
        if (mounted) setSeries(EMPTY_SERIES[filter]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    intervalId = setInterval(load, REFRESH_INTERVAL);

    return () => {
      mounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [filter, query]);

  const allZero = series.every((p) => p.amount === 0);

  return (
    <Card className="h-full border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-semibold text-gray-800">
          {campaignId && !userId
            ? "Arrecadação da campanha"
            : "Arrecadação (período)"}
        </CardTitle>

        <Select
          value={filter}
          onValueChange={(v) => setFilter(v as FilterOption)}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Filtrar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dia">Dia</SelectItem>
            <SelectItem value="semana">Semana</SelectItem>
            <SelectItem value="mes">Mês</SelectItem>
            <SelectItem value="ano">Ano</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-center p-4">
        <div className="relative min-h-[250px] w-full flex-1">
          {allZero && !loading && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
              Nenhuma doação registrada ainda
            </div>
          )}

          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                interval={0}
                tickMargin={8}
              />
              <YAxis
                stroke="#6b7280"
                allowDecimals={false}
                domain={allZero ? [0, 100] : ["auto", "auto"]}
                tickFormatter={(v) =>
                  v >= 1000 ? `R$ ${(v / 1000).toFixed(0)}k` : `R$ ${v}`
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
                formatter={(value: number) => [
                  `R$ ${Number(value).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`,
                  "Arrecadação",
                ]}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#2563eb"
                strokeWidth={2}
                strokeOpacity={allZero ? 0.3 : 1}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={!loading}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
