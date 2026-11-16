"use client";

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
      footerText="Нет аккаунта?"
      footerLink={{ href: "/registration", label: "Зарегистрироваться" }}
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
