"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

export default function RegistrationPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (password !== confirmPassword) {
      setPasswordError("Пароли не совпадают");
      return;
    }

    setIsLoading(true);

    // TODO: implement registration logic
    console.log({ email, password });

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Создание аккаунта
          </h1>
          <p className="text-sm text-muted-foreground">
            Заполните данные для регистрации
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-black/40 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl"
        >
          <div className="mb-6 space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-xs font-medium text-muted-foreground"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                required
                className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-muted-foreground/60 outline-none transition-all focus:border-brand-violet/50 focus:ring-1 focus:ring-brand-violet/30 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-xs font-medium text-muted-foreground"
              >
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-muted-foreground/60 outline-none transition-all focus:border-brand-violet/50 focus:ring-1 focus:ring-brand-violet/30 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-xs font-medium text-muted-foreground"
              >
                Подтвердите пароль
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
                placeholder="••••••••"
                required
                className={`flex h-10 w-full rounded-lg border px-3.5 py-2.5 text-sm text-white placeholder:text-muted-foreground/60 outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                  passwordError
                    ? "border-red-500/50 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
                    : "border-white/10 bg-white/5 focus:border-brand-violet/50 focus:ring-1 focus:ring-brand-violet/30"
                }`}
              />
              {passwordError && (
                <p className="text-xs text-red-400">{passwordError}</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="relative flex h-10 w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-brand-violet to-brand-pink text-sm font-semibold text-white shadow-[0_4px_16px_rgba(139,92,246,0.35)] transition-all hover:shadow-[0_6px_24px_rgba(139,92,246,0.5)] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="size-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Регистрация...
              </span>
            ) : (
              "Зарегистрироваться"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Уже есть аккаунт?{" "}
          <Link
            href="/login"
            className="font-medium text-white underline-offset-4 hover:underline"
          >
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
