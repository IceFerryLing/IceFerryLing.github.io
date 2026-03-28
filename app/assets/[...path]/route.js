import path from "node:path";
import { promises as fs } from "node:fs";
import { NextResponse } from "next/server";

const MIME_MAP = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8"
};

function safeJoin(basePath, segments) {
  const targetPath = path.resolve(basePath, ...segments);
  if (!targetPath.startsWith(path.resolve(basePath))) {
    return null;
  }
  return targetPath;
}

export async function GET(_request, { params }) {
  const resolvedParams = await params;
  const segments = resolvedParams.path || [];
  const basePath = path.join(process.cwd(), "assets");
  const filePath = safeJoin(basePath, segments);

  if (!filePath) {
    return new NextResponse("Invalid path", { status: 400 });
  }

  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_MAP[ext] || "application/octet-stream";
    return new NextResponse(data, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
