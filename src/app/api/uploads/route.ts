import { NextRequest, NextResponse } from "next/server";
import { generateUploadUrl } from "@/lib/r2";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/constants";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  const { fileName, mimeType, fileSize } = await request.json();

  if (!fileName || !mimeType || !fileSize) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  if (!ALLOWED_FILE_TYPES.includes(mimeType)) {
    return NextResponse.json(
      { error: "File type not allowed" },
      { status: 400 },
    );
  }

  if (fileSize > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File too large. Maximum size is 10MB." },
      { status: 400 },
    );
  }

  const ext = fileName.split(".").pop() || "bin";
  const fileKey = `attachments/${randomUUID()}.${ext}`;

  const { uploadUrl, publicUrl } = await generateUploadUrl(fileKey, mimeType);

  return NextResponse.json({ uploadUrl, fileKey, publicUrl });
}
