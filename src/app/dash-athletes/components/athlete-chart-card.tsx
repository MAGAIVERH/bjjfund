"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ChartContainer } from "@/components/ui/chart";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const dataMock = {
  dia: [
    { name: "Seg", amount: 200 },
    { name: "Ter", amount: 400 },
    { name: "Qua", amount: 150 },
    { name: "Qui", amount: 500 },
    { name: "Sex", amount: 300 },
    { name: "Sáb", amount: 700 },
    { name: "Dom", amount: 100 },
  ],
  semana: [
    { name: "Semana 1", amount: 1200 },
    { name: "Semana 2", amount: 1800 },
    { name: "Semana 3", amount: 900 },
    { name: "Semana 4", amount: 2200 },
  ],
  mes: [
    { name: "Jan", amount: 3500 },
    { name: "Fev", amount: 4100 },
    { name: "Mar", amount: 3000 },
    { name: "Abr", amount: 5000 },
    { name: "Mai", amount: 6200 },
    { name: "Jun", amount: 4800 },
    { name: "Jul", amount: 5600 },
    { name: "Ago", amount: 7300 },
    { name: "Set", amount: 6100 },
    { name: "Out", amount: 7500 },
    { name: "Nov", amount: 8200 },
    { name: "Dez", amount: 9100 },
  ],
  ano: [
    { name: "2021", amount: 25000 },
    { name: "2022", amount: 42000 },
    { name: "2023", amount: 60000 },
    { name: "2024", amount: 81000 },
  ],
};

type FilterOption = "dia" | "semana" | "mes" | "ano";

export function AthleteChartCard() {
  const [filter, setFilter] = useState<FilterOption>("mes");
  const data = dataMock[filter];

  return (
    <Card className="h-full border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-semibold text-gray-800">
          Arrecadação ({filter})
        </CardTitle>
        <Select
          value={filter}
          onValueChange={(val) => setFilter(val as FilterOption)}
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
        <div className="min-h-[250px] w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
                formatter={(value: number) => [
                  `R$ ${value.toFixed(2)}`,
                  "Arrecadação",
                ]}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
