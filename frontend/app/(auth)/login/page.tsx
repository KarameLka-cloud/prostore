"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useActionState } from "react";

import { AuthShell, loginAction } from "@/features/auth";
import InputField from "@/shared/ui/custom/input-field";
import PrimaryButton from "@/shared/ui/custom/primary-button";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, {});

  return (
    <AuthShell
      title="Вход в аккаунт"
      description="Введите данные для входа в свой аккаунт"
      belowCard={
        <Link
          href="/"
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Вернуться на сайт
        </Link>
      }
    >
      <form action={formAction} className="space-y-5">
        <InputField
          id="login"
          name="login"
          type="text"
          autoComplete="username"
          label="Логин"
          placeholder="admin"
          required
        />

        <InputField
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          label="Пароль"
          placeholder="••••••••"
          required
        />

        {state.error && (
          <p role="alert" className="text-xs text-red-400">
            {state.error}
          </p>
        )}

        <PrimaryButton loading={isPending} loadingText="Вход...">
          Войти
        </PrimaryButton>
      </form>
    </AuthShell>
  );
}
