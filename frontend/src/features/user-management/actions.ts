"use server";

import { runAction } from "@/shared/lib/action-result";

import type { UpdateAdminUser } from "./api";
import {
  deleteAdminUser as deleteAdminUserRequest,
  loadAdminUsers,
  saveAdminUser as saveAdminUserRequest,
} from "./server";

export async function loadAdminUsersAction() {
  return runAction("Не удалось загрузить пользователей", loadAdminUsers);
}

export async function saveAdminUserAction(
  id: number | null,
  payload: UpdateAdminUser,
) {
  return runAction("Не удалось сохранить пользователя", () =>
    saveAdminUserRequest(id, payload),
  );
}

export async function deleteAdminUserAction(id: number) {
  return runAction("Не удалось удалить пользователя", () =>
    deleteAdminUserRequest(id),
  );
}
