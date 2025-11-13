import { eq } from "drizzle-orm";

import { db } from "@/db";
import { athletes,campaigns } from "@/db/schema";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return Response.json({ hasActive: false });
  }

  const athlete = await db
    .select({ id: athletes.id })
    .from(athletes)
    .where(eq(athletes.userId, userId))
    .limit(1);

  if (!athlete.length) {
    return Response.json({ hasActive: false });
  }

  const campaign = await db
    .select({ id: campaigns.id })
    .from(campaigns)
    .where(eq(campaigns.athleteId, athlete[0].id))
    .limit(1);

  return Response.json({ hasActive: campaign.length > 0 });
}
