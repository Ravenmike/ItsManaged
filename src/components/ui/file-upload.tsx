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
}

export function FileUpload({ onFilesUploaded, existingFiles = [] }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<UploadedFile[]>(existingFiles);

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
      <label className="block text-sm font-medium text-gray-700">
        Attachments
      </label>
      <div
        className="rounded-md border-2 border-dashed border-gray-300 p-4 text-center text-sm text-gray-500 hover:border-gray-400 cursor-pointer"
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
      {error && <p className="text-sm text-red-600">{error}</p>}
      {files.length > 0 && (
        <ul className="space-y-1">
          {files.map((file, i) => (
            <li key={i} className="flex items-center justify-between rounded bg-gray-50 px-3 py-1.5 text-sm">
              <span className="truncate">{file.fileName}</span>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="ml-2 text-red-500 hover:text-red-700"
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
