import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const urlParts = req.nextUrl.pathname.split("/");
    const project_id = urlParts[urlParts.length - 1];

    const body = await req.json();
    const {
      name,
      url,
      deploy_url,
      state,
      deploy_time,
      commit_ref,
      error_message,
    } = body;

    if (!name || !deploy_url || !state) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.project_id, project_id))
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const webhookLark = project[0].webhook_lark;

    let totalDeploy = project[0].total_deploy ?? 0;
    let successCount = project[0].success_count ?? 0;
    let failedCount = project[0].failed_count ?? 0;

    let message = "";

    if (state === "building") {
      message = `🚀 Deploy started for ${name}\nCommit ID: ${commit_ref}`;
      totalDeploy += 1;
      console.log("payload netlify:", body);
    } else if (state === "ready") {
      message = `✅ Deploy succeeded for ${name}\nCommit ID: ${commit_ref}\nDeploy URL: ${deploy_url} \nProduction URL: ${url}\nDeploy time: ${deploy_time}s`;
      successCount += 1;
      console.log("payload netlify:", body);
    } else if (state === "error") {
      message = `❌ Deploy failed for ${name}\nCommit ID: ${commit_ref}\nError: ${error_message}`;
      failedCount += 1;
      console.log("payload netlify:", body);
    }

    const updateResult = await db
      .update(projects)
      .set({
        total_deploy: totalDeploy,
        success_count: successCount,
        failed_count: failedCount,
      })
      .where(eq(projects.project_id, project_id))
      .returning();

    console.log("Update result:", updateResult);

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
