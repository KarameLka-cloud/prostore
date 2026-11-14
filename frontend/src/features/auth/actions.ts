"use server";

import { redirect } from "next/navigation";

import { authenticate, type AuthUser } from "@/features/auth/api/auth";
import { createSession, deleteSession } from "@/features/auth/lib/cookies";

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const login = String(formData.get("login") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!login || !password) {
    return { error: "Введите логин и пароль" };
  }

  let user: AuthUser | null;

  try {
    user = await authenticate(login, password);
  } catch (error) {
    console.error("Failed to authenticate user", error);

    return {
      error: "Сервис авторизации недоступен. Попробуйте позже.",
    };
  }

  if (!user) {
    return { error: "Неверный логин или пароль" };
  }

  await createSession(user);

  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await deleteSession();

  redirect("/");
}
