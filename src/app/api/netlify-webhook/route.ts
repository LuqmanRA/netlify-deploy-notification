import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Ambil data dari payload Netlify
    const { name, deploy_url, state } = body;
    if (!name || !deploy_url || !state) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Kirim notifikasi ke Lark menggunakan fetch
    const response = await fetch(process.env.LARK_WEBHOOK_URL!, {
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
