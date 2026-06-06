import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "downloads", "lincies-house-tin-nhan-tu-dong.pdf");
  const file = await readFile(filePath);

  return new Response(file, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="lincies-house-tin-nhan-tu-dong.pdf"',
      "Content-Length": file.byteLength.toString(),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
