// import { db } from "@/db";
// import { roles, userRoles, users } from "@/db/schema";

// import bcrypt from "bcryptjs";

// async function seed() {
//   // cria role admin se não existir
//   let adminRole = await db.select().from(roles).where({ name: "admin" }).get();
//   if (!adminRole) {
//     const [insertedRole] = await db
//       .insert(roles)
//       .values({ name: "admin" })
//       .returning();
//     adminRole = insertedRole;
//   }

//   // pega credenciais do .env
//   const adminEmail = process.env.ADMIN_EMAIL;
//   const adminPassword = process.env.ADMIN_PASSWORD;

//   if (!adminEmail || !adminPassword) {
//     throw new Error("Faltando variáveis ADMIN_EMAIL ou ADMIN_PASSWORD no .env");
//   }

//   // cria usuário admin
//   const passwordHash = await bcrypt.hash(adminPassword, 10);
//   const [adminUser] = await db
//     .insert(users)
//     .values({
//       email: adminEmail,
//       passwordHash,
//       isActive: true,
//     })
//     .returning();

//   // associa admin à role
//   await db.insert(userRoles).values({
//     userId: adminUser.id,
//     roleId: adminRole.id,
//   });
// }

// seed().catch(console.error);
