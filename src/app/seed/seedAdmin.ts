import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

import { db } from "@/db";
import {
  account as baAccount,
  roles,
  user as baUser,
  userRoles,
} from "@/db/schema";

async function seed() {
  // 1️⃣ cria role admin se não existir
  const existingRoles = await db
    .select()
    .from(roles)
    .where(sql`${roles.name} = 'admin'`);
  let adminRole = existingRoles[0];

  if (!adminRole) {
    const insertedRoles = await db
      .insert(roles)
      .values([{ name: "admin" }])
      .returning(); // retorna todas as colunas
    adminRole = insertedRoles[0];
  }

  // 2️⃣ pega credenciais do .env
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || "Admin";

  if (!adminEmail || !adminPassword) {
    throw new Error("Faltando variáveis ADMIN_EMAIL ou ADMIN_PASSWORD no .env");
  }

  // 3️⃣ cria hash da senha
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  // 4️⃣ cria usuário na tabela Better Auth
  const adminId = uuidv4();
  const now = new Date();

  const insertedUsers = await db
    .insert(baUser)
    .values([
      {
        id: adminId,
        name: adminName,
        email: adminEmail,
        emailVerified: true,
        image: null,
        role: "admin",
        createdAt: now,
        updatedAt: now,
      },
    ])
    .returning(); // retorna todas as colunas

  const createdUser = insertedUsers[0];

  // 5️⃣ associa admin à role na tabela userRoles
  await db.insert(userRoles).values([
    {
      userId: createdUser.id,
      roleId: adminRole.id,
      primary: true,
    },
  ]);

  // 6️⃣ cria conta para login local
  await db.insert(baAccount).values([
    {
      id: uuidv4(),
      accountId: adminEmail,
      providerId: "email",
      userId: createdUser.id,
      password: passwordHash,
      createdAt: now,
      updatedAt: now,
    },
  ]);

  console.log("Admin criado com sucesso!");
}

seed().catch(console.error);
