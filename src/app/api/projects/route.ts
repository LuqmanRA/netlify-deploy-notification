import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET: Ambil semua project
export async function GET() {
  const data = await db.select().from(projects);
  return NextResponse.json(data);
}

// POST: Tambah project baru dengan validasi multiple error
export async function POST(req: Request) {
  const { projectId, webhookLark } = await req.json();

  let errors: Record<string, string> = {}; // Simpan semua error

  if (!projectId) errors.projectId = "Project ID is required";
  if (!webhookLark) errors.webhookLark = "Webhook Lark is required";

  // Validasi URL Webhook
  const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
  if (webhookLark && !urlRegex.test(webhookLark)) {
    errors.webhookLark = "Invalid Webhook Lark URL format";
  }

  // Cek apakah projectId sudah ada di database
  const existingProject = await db
    .select()
    .from(projects)
    .where(eq(projects.project_id, projectId));

  if (existingProject.length > 0) {
    errors.projectId = "Project ID already exists";
  }

  // Jika ada error, return semua sekaligus
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  // Simpan ke database jika tidak ada error
  await db
    .insert(projects)
    .values({ project_id: projectId, webhook_lark: webhookLark });

  return NextResponse.json({ message: "Project saved" }, { status: 201 });
}

// PUT: Update project dengan validasi multiple error
export async function PUT(req: Request) {
  const { id, projectId, webhookLark } = await req.json();

  let errors: Record<string, string> = {};

  if (!id) errors.id = "ID is required";
  if (!projectId) errors.projectId = "Project ID is required";
  if (!webhookLark) errors.webhookLark = "Webhook Lark is required";

  // Jika ada error langsung kirim response
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  // Validasi URL menggunakan regex
  const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
  if (!urlRegex.test(webhookLark)) {
    errors.webhookLark = "Invalid Webhook Lark URL format";
  }

  // Cek apakah ID ada di database
  const existingProject = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id));

  if (existingProject.length === 0) {
    errors.id = "Project not found";
  }

  // Cek apakah projectId sudah digunakan oleh project lain
  const duplicateProject = await db
    .select()
    .from(projects)
    .where(eq(projects.project_id, projectId));

  if (duplicateProject.length > 0 && duplicateProject[0].id !== id) {
    errors.projectId = "Project ID already exists";
  }

  // Jika ada error setelah pengecekan di DB, kirim response
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  // Update project
  await db
    .update(projects)
    .set({ project_id: projectId, webhook_lark: webhookLark })
    .where(eq(projects.id, id));

  return NextResponse.json({ message: `Project ${id} updated` });
}

// DELETE: Hapus project berdasarkan ID dengan validasi
export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { errors: { id: "ID is required" } },
      { status: 400 }
    );
  }

  // Cek apakah ID ada di database
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

  // Hapus project
  await db.delete(projects).where(eq(projects.id, id));

  return NextResponse.json({ message: `Project ${id} deleted` });
}
