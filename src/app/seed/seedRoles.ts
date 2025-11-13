import { eq } from "drizzle-orm";

import { db } from "@/db";
import { roles } from "@/db/schema";

async function seedRoles() {
  const defaultRoles = ["admin", "athlete", "supporter"];

  for (const roleName of defaultRoles) {
    const [existingRole] = await db
      .select()
      .from(roles)
      .where(eq(roles.name, roleName))
      .limit(1)
      .execute();

    if (!existingRole) {
      await db.insert(roles).values({ name: roleName }).execute();
    }
  }

  console.log("Roles seedadas com sucesso!");
}

seedRoles().catch(console.error);
