import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db"; // Import database
import { projects } from "@/db/schema"; // Import model project
import { eq } from "drizzle-orm";

// Fungsi untuk kirim notifikasi ke Lark
async function sendLarkNotification(webhookUrl: string, message: string) {
  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ msg_type: "text", content: { text: message } }),
  });
}

export async function POST(
  req: NextRequest,
  context: { params: { projectId: string } }
) {
  const { projectId } = context.params;
  const data = await req.json();

  // Ambil project dari database berdasarkan projectId
  const project = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  if (!project || project.length === 0) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const webhookLark = project[0].webhook_lark;
  if (!webhookLark) {
    return NextResponse.json(
      { error: "No Lark Webhook found" },
      { status: 400 }
    );
  }

  // Ambil status dari payload Netlify
  const deployStatus = data.state; // misalnya "ready", "building", "failed"
  const siteName = data.name;
  const deployUrl = data.deploy_ssl_url || data.admin_url;

  const message = `🚀 Deploy Update: **${siteName}**\n🔹 Status: ${deployStatus}\n🔗 [View Deploy](${deployUrl})`;

  // Kirim notifikasi ke Lark
  await sendLarkNotification(webhookLark, message);

  return NextResponse.json({ message: "Notification sent" });
}
