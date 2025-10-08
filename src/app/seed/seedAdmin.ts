// import { db } from "@/db";
// import { roles, userRoles } from "@/db/schema"; // suas tabelas de roles
// import { user as baUser } from "@/db/auth-schema"; // tabela Better Auth
// import bcrypt from "bcryptjs";
// import { v4 as uuidv4 } from "uuid";

// async function seed() {
//   // 1️⃣ cria role admin se não existir
//   let adminRole = await db.select().from(roles).where({ name: "admin" }).get();
//   if (!adminRole) {
//     const [insertedRole] = await db
//       .insert(roles)
//       .values({ name: "admin" })
//       .returning();
//     adminRole = insertedRole;
//   }

//   // 2️⃣ pega credenciais do .env
//   const adminEmail = process.env.ADMIN_EMAIL;
//   const adminPassword = process.env.ADMIN_PASSWORD;
//   const adminName = process.env.ADMIN_NAME || "Admin";

//   if (!adminEmail || !adminPassword) {
//     throw new Error("Faltando variáveis ADMIN_EMAIL ou ADMIN_PASSWORD no .env");
//   }

//   // 3️⃣ cria hash da senha
//   const passwordHash = await bcrypt.hash(adminPassword, 10);

//   // 4️⃣ cria usuário na tabela Better Auth
//   const adminId = uuidv4(); // garante ID único
//   const now = new Date();

//   const [createdUser] = await db
//     .insert(baUser)
//     .values({
//       id: adminId,
//       name: adminName,
//       email: adminEmail,
//       emailVerified: true, // admin já verificado
//       image: null,
//       password: passwordHash, // pode usar o campo password do Better Auth
//       createdAt: now,
//       updatedAt: now,
//     })
//     .returning();

//   // 5️⃣ associa admin à role na sua tabela de roles
//   await db.insert(userRoles).values({
//     userId: createdUser.id,
//     roleId: adminRole.id,
//     primary: true,
//   });

//   console.log("Admin criado com sucesso!");
// }

// seed().catch(console.error);
