import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";

export async function POST(req: Request) {
  const { projectId, webhookLark } = await req.json();

  await db
    .insert(projects)
    .values({ id: projectId, name: "My Project", webhook_lark: webhookLark });

  return NextResponse.json({ message: "Project saved" });
}
