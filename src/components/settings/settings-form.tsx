"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateWorkspaceSettings } from "@/actions/settings";

interface SettingsFormProps {
  workspace: {
    name: string;
    supportEmail: string;
    brandColor: string;
  };
}

export function SettingsForm({ workspace }: SettingsFormProps) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setMessage(null);
    const result = await updateWorkspaceSettings(formData);
    setPending(false);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "Settings saved successfully." });
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <Input
        label="Workspace Name"
        name="name"
        id="name"
        defaultValue={workspace.name}
        required
      />

      <Input
        label="Support Email"
        name="supportEmail"
        id="supportEmail"
        type="email"
        defaultValue={workspace.supportEmail}
        required
      />

      <div className="space-y-1">
        <label
          htmlFor="brandColor"
          className="block text-sm font-medium text-gray-700"
        >
          Brand Color
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            id="brandColor"
            name="brandColor"
            defaultValue={workspace.brandColor}
            className="h-10 w-14 cursor-pointer rounded border border-gray-300"
          />
          <Input
            name="brandColorHex"
            defaultValue={workspace.brandColor}
            placeholder="#2563eb"
            className="max-w-[140px]"
            onChange={(e) => {
              const colorInput = document.getElementById(
                "brandColor",
              ) as HTMLInputElement;
              if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
                colorInput.value = e.target.value;
              }
            }}
          />
        </div>
      </div>

      {message && (
        <p
          className={`text-sm ${message.type === "error" ? "text-red-600" : "text-green-600"}`}
        >
          {message.text}
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  );
}
