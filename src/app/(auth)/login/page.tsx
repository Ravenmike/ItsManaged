"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-full items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-brand-600">
            ItsManaged
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to the agent dashboard
          </p>
        </div>

        <form action={formAction} className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="agent@example.com"
            required
            autoComplete="email"
          />

          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            required
            autoComplete="current-password"
          />

          {state?.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
