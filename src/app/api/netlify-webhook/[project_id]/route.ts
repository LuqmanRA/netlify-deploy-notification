import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    // Ambil project_id dari URL
    const urlParts = req.nextUrl.pathname.split("/");
    const project_id = urlParts[urlParts.length - 1]; // Ambil bagian terakhir dari path

    const body = await req.json();

    // Ambil data dari payload Netlify
    const { name, deploy_url, state } = body;
    if (!name || !deploy_url || !state) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Cari project di database berdasarkan project_id
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.project_id, project_id))
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const webhookLark = project[0].webhook_lark;

    // Kirim notifikasi ke Lark menggunakan webhook dari database
    const response = await fetch(webhookLark, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        msg_type: "text",
        content: {
          text: `🚀 Deploy *${name}* berhasil! 🎉\n🔗 ${deploy_url}\n📊 Status: ${state}`,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send notification: ${response.statusText}`);
    }

    return NextResponse.json(
      { message: "Notification sent to Lark" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
