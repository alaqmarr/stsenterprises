import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const config = await db.appConfig.findUnique({ where: { id: 1 } });
    return NextResponse.json(config || {});
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const config = await db.appConfig.upsert({
      where: { id: 1 },
      update: { ...data, id: 1 }, // Ensure ID is 1
      create: { ...data, id: 1 },
    });
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
