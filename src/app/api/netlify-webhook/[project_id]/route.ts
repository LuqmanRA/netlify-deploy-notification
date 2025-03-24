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
    const { name, deploy_url, state, error_message } = body;

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

    // Tentukan pesan berdasarkan status deploy
    let message = "";
    let totalDeploy = project[0].total_deploy || 0;
    let successCount = project[0].success_count || 0;
    let failedCount = project[0].failed_count || 0;

    if (state === "building") {
      message = `🏗 Deploy *${name}* sedang dimulai...\n🔗 ${deploy_url}`;
    } else if (state === "ready") {
      message = `✅ Deploy *${name}* berhasil! 🎉\n🔗 ${deploy_url}`;
      successCount += 1;
    } else if (state === "error") {
      message = `❌ Deploy *${name}* gagal!\n🔗 ${deploy_url}* ${error_message}`;
      failedCount += 1;
    }

    totalDeploy += 1;

    // Update counter di database
    await db
      .update(projects)
      .set({
        total_deploy: totalDeploy,
        success_count: successCount,
        failed_count: failedCount,
      })
      .where(eq(projects.project_id, project_id));

    // Kirim notifikasi ke Lark
    if (message) {
      const response = await fetch(webhookLark, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          msg_type: "text",
          content: { text: message },
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send notification: ${response.statusText}`);
      }
    }

    return NextResponse.json(
      {
        message: "Notification sent to Lark",
        totalDeploy,
        successCount,
        failedCount,
      },
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
