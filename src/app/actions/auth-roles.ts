"use server";
import { db } from "@/db";
import { userRoles, roles, user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function setRole(userId: string, role: "athlete" | "supporter") {
  console.log(" setRole called with:", { userId, role });

  const [dbRole] = await db
    .select()
    .from(roles)
    .where(eq(roles.name, role))
    .limit(1);

  if (!dbRole) {
    console.log("[v0] Error: Role not found in database:", role);
    throw new Error(`Role "${role}" não encontrada`);
  }

  console.log("[v0] Found role in database:", dbRole);

  const [existing] = await db
    .select()
    .from(userRoles)
    .where(eq(userRoles.userId, userId))
    .limit(1);

  if (existing) {
    console.log(" Updating existing userRole");
    await db
      .update(userRoles)
      .set({ roleId: dbRole.id, primary: true })
      .where(eq(userRoles.userId, userId));
  } else {
    console.log(" Creating new userRole");
    await db
      .insert(userRoles)
      .values({ userId, roleId: dbRole.id, primary: true });
  }

  // para indicar que a seleção de role foi concluída
  console.log(" Updating user table with role:", role);
  await db
    .update(user)
    .set({
      role,
      emailVerified: true, // Marca como verificado após escolher role
    })
    .where(eq(user.id, userId));

  console.log(`[v0] ✅ Role "${role}" salva para ${userId}`);
}
