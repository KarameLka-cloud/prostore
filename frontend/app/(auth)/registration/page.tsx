"use client";

import { useState, type FormEvent } from "react";

import { AuthShell } from "@/features/auth";
import InputField from "@/shared/ui/custom/input-field";
import PrimaryButton from "@/shared/ui/custom/primary-button";

export default function RegistrationPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordError("");

    if (password !== confirmPassword) {
      setPasswordError("Пароли не совпадают");
      return;
    }

    setIsLoading(true);

    // TODO: implement registration logic
    setIsLoading(false);
  };

  return (
    <AuthShell
      title="Создание аккаунта"
      description="Заполните данные для регистрации"
      footerText="Уже есть аккаунт?"
      footerLink={{ href: "/login", label: "Войти" }}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          label="Email"
          placeholder="example@mail.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <InputField
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          label="Пароль"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <InputField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          label="Подтвердите пароль"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            if (passwordError) setPasswordError("");
          }}
          error={passwordError}
          required
        />

        <PrimaryButton loading={isLoading} loadingText="Регистрация...">
          Зарегистрироваться
        </PrimaryButton>
      </form>
    </AuthShell>
  );
}
