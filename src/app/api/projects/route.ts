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

  let errors: Record<string, string> = {};

  if (!projectId) errors.projectId = "Project ID is required";
  if (!webhookLark) errors.webhookLark = "Webhook Lark is required";

  const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
  if (webhookLark && !urlRegex.test(webhookLark)) {
    errors.webhookLark = "Invalid Webhook Lark URL format";
  }

  const existingProject = await db
    .select()
    .from(projects)
    .where(eq(projects.project_id, projectId));

  if (existingProject.length > 0) {
    errors.projectId = "Project ID already exists";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  await db
    .insert(projects)
    .values({ project_id: projectId, webhook_lark: webhookLark });

  return NextResponse.json({ message: "Project saved" }, { status: 201 });
}

export async function PUT(req: Request) {
  const { id, projectId, webhookLark } = await req.json();

  let errors: Record<string, string> = {};

  if (!id) errors.id = "ID is required";
  if (!projectId) errors.projectId = "Project ID is required";
  if (!webhookLark) errors.webhookLark = "Webhook Lark is required";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
  if (!urlRegex.test(webhookLark)) {
    errors.webhookLark = "Invalid Webhook Lark URL format";
  }

  const existingProject = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id));

  if (existingProject.length === 0) {
    errors.id = "Project not found";
  }

  const duplicateProject = await db
    .select()
    .from(projects)
    .where(eq(projects.project_id, projectId));

  if (duplicateProject.length > 0 && duplicateProject[0].id !== id) {
    errors.projectId = "Project ID already exists";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  await db
    .update(projects)
    .set({ project_id: projectId, webhook_lark: webhookLark })
    .where(eq(projects.id, id));

  return NextResponse.json({ message: `Project ${id} updated` });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { errors: { id: "ID is required" } },
      { status: 400 }
    );
  }

  const existingProject = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id));

  if (existingProject.length === 0) {
    return NextResponse.json(
      { errors: { id: "Project not found" } },
      { status: 404 }
    );
  }

  await db.delete(projects).where(eq(projects.id, id));

  return NextResponse.json({ message: `Project ${id} deleted` });
}
