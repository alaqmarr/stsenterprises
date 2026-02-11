import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const brand = await db.brand.findUnique({ where: { id } });
      if (!brand)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(brand);
    }

    const brands = await db.brand.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(brands);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, logo } = await req.json();
    const slug = slugify(name);

    const brand = await db.brand.create({
      data: { name, slug, logo },
    });

    return NextResponse.json(brand);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, name, logo } = await req.json();
    if (!id)
      return NextResponse.json({ error: "ID required" }, { status: 400 });

    const brand = await db.brand.update({
      where: { id },
      data: { name, logo },
    });

    return NextResponse.json(brand);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (req.method === "DELETE") {
    try {
      // Check for bulk delete in body first
      const body = await req.json().catch(() => null);
      if (body && body.ids && Array.isArray(body.ids)) {
        await db.brand.deleteMany({
          where: {
            id: { in: body.ids },
          },
        });
        return NextResponse.json({ success: true });
      }
    } catch (e) {
      // fallback
    }
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  try {
    await db.brand.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
