import type React from "react";
import { RoleGuard } from "../components/role-guard";

export default function AthleteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleGuard>{children}</RoleGuard>;
}
