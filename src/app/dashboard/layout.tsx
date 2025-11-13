"use client";

import React from "react";

import { RoleGuard } from "../components/role-guard";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <RoleGuard>
      <div className="flex min-h-screen flex-col">
        {/* Aqui você pode colocar seu Header se houver */}
        <main className="flex-1">{children}</main>
        {/* Footer opcional */}
      </div>
    </RoleGuard>
  );
}
