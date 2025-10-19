import { type NextRequest, NextResponse } from "next/server";
import { setRole } from "@/app/actions/auth-roles";

export async function POST(req: NextRequest) {
  try {
    const { userId, role } = await req.json();

    console.log(" API select-role received:", { userId, role });

    if (!userId) {
      console.log("[v0] Error: No userId provided");
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 },
      );
    }

    if (role !== "athlete" && role !== "supporter") {
      console.log(" Error: Invalid role:", role);
      return NextResponse.json({ error: "Role inválida" }, { status: 400 });
    }

    await setRole(userId, role);

    console.log("[v0] Role set successfully for user:", userId);

    return NextResponse.json({
      message: "Role definida com sucesso!",
      role,
    });
  } catch (err) {
    console.error("[v0] Error in select-role API:", err);
    return NextResponse.json(
      { error: "Erro ao definir a role" },
      { status: 500 },
    );
  }
}
