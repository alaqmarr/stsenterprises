import { NextResponse } from "next/server";
import db from "@/lib/db";
import * as bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    const count = await db.user.count();
    if (count > 0) {
      return NextResponse.json(
        { setup: false, message: "Already setup" },
        { status: 403 },
      );
    }
    return NextResponse.json({ setup: true });
  } catch (error) {
    return NextResponse.json({ error: "Check failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    const count = await db.user.count();
    if (count > 0) {
      return NextResponse.json(
        { message: "Setup already completed" },
        { status: 403 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    const config = await db.appConfig.findUnique({ where: { id: 1 } });
    if (!config) {
      await db.appConfig.create({
        data: {
          id: 1,
          companyName: "STS Enterprises",
          companyDesc:
            "Leading Wholesale Trader of Hand Protection, Safety Gloves, Hillson Gumboots, etc.",
          address:
            "# 5-5-47, Near Bombay Hotel, Shiva Chambers, Ranigunj-Secunderabad-500003",
          phone: "040-12345678",
          email: email,
        },
      });
    }

    return NextResponse.json({ message: "Setup successful" });
  } catch (error) {
    console.error("Setup Error:", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
