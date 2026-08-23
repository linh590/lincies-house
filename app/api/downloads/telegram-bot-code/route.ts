import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "downloads", "lincies-house-airbnb-host-bot-index.js");
  const file = await readFile(filePath);

  return new Response(file, {
    headers: {
      "Content-Type": "text/javascript; charset=utf-8",
      "Content-Disposition": 'attachment; filename="lincies-house-airbnb-host-bot-index.js"',
      "Content-Length": file.byteLength.toString(),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
