import { connection } from "next/server";
import { AdminUsersPage } from "@/pages/admin-users";
import type { AdminUser } from "@/features/user-management/api";
import { loadAdminUsers } from "@/features/user-management/server";
import { getErrorMessage } from "@/shared/lib/errors";

export const instant = false;

export default async function AdminUsersRoute() {
  await connection();

  let initialUsers: AdminUser[] = [];
  let initialError: string | undefined;

  try {
    initialUsers = await loadAdminUsers();
  } catch (cause) {
    initialError = getErrorMessage(cause, "Не удалось загрузить пользователей");
  }

  return (
    <AdminUsersPage initialUsers={initialUsers} initialError={initialError} />
  );
}
