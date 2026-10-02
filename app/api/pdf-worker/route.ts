import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-static";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "pdf.worker.min.mjs");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Worker file not found" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[api/pdf-worker] Error serving worker:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
