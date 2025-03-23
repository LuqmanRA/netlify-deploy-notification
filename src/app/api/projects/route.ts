import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const data = await db.select().from(projects);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { projectId, webhookLark } = await req.json();

  await db
    .insert(projects)
    .values({ project_id: projectId, webhook_lark: webhookLark });

  return NextResponse.json({ message: "Project saved" });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  await db.delete(projects).where(eq(projects.id, id));

  return NextResponse.json({ message: `Project ${id} deleted` });
}

export async function PUT(req: Request) {
  const { id, projectId, webhookLark } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  await db
    .update(projects)
    .set({ project_id: projectId, webhook_lark: webhookLark })
    .where(eq(projects.id, id));

  return NextResponse.json({ message: `Project ${id} updated` });
}
