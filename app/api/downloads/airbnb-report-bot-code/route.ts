import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "downloads", "airbnb-report-bot-template-chatid-listings-only.js");
  const file = await readFile(filePath);

  return new Response(file, {
    headers: {
      "Content-Type": "text/javascript; charset=utf-8",
      "Content-Disposition": 'attachment; filename="airbnb-report-bot-template-chatid-listings-only.js"',
      "Content-Length": file.byteLength.toString(),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
