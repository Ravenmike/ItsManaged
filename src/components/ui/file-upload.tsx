"use client";

import { useRef, useState } from "react";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/constants";

export interface UploadedFile {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

interface FileUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
  existingFiles?: UploadedFile[];
  variant?: "light" | "dark";
}

export function FileUpload({ onFilesUploaded, existingFiles = [], variant = "light" }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<UploadedFile[]>(existingFiles);
  const isDark = variant === "dark";

  async function handleFiles(fileList: FileList) {
    setError(null);
    setUploading(true);

    const newFiles: UploadedFile[] = [];

    for (const file of Array.from(fileList)) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setError(`${file.name}: File type not allowed`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`${file.name}: File too large (max 10MB)`);
        continue;
      }

      try {
        // Get pre-signed upload URL
        const res = await fetch("/api/uploads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            mimeType: file.type,
            fileSize: file.size,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Upload failed");
          continue;
        }

        const { uploadUrl, publicUrl } = await res.json();

        // Upload directly to R2
        await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        newFiles.push({
          fileName: file.name,
          fileUrl: publicUrl,
          fileSize: file.size,
          mimeType: file.type,
        });
      } catch {
        setError(`${file.name}: Upload failed`);
      }
    }

    const allFiles = [...files, ...newFiles];
    setFiles(allFiles);
    onFilesUploaded(allFiles);
    setUploading(false);
  }

  function removeFile(index: number) {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesUploaded(updated);
  }

  return (
    <div className="space-y-2">
      <label className={`block text-sm font-medium ${isDark ? "text-white/80" : "text-gray-700"}`}>
        Attachments
      </label>
      <div
        className={`rounded-lg border-2 border-dashed p-4 text-center text-sm cursor-pointer transition-colors ${
          isDark
            ? "border-white/20 text-white/50 hover:border-violet/50 hover:text-white/70"
            : "border-gray-300 text-gray-500 hover:border-gray-400"
        }`}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          "Uploading..."
        ) : (
          <>Click to attach files (max 10MB each)</>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        accept={ALLOWED_FILE_TYPES.join(",")}
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
      {error && <p className={`text-sm ${isDark ? "text-red-400" : "text-red-600"}`}>{error}</p>}
      {files.length > 0 && (
        <ul className="space-y-1">
          {files.map((file, i) => (
            <li key={i} className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-sm ${
              isDark ? "bg-white/8 text-white/75" : "bg-gray-50 text-gray-700"
            }`}>
              <span className="truncate">{file.fileName}</span>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="ml-2 text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
