"use client";

import { useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import {
  deleteAdminUserAction,
  saveAdminUserAction,
} from "@/features/user-management/actions";
import type {
  AdminUser,
  UpdateAdminUser,
} from "@/features/user-management/api";
import { unwrapActionResult } from "@/shared/lib/action-result";
import { Button } from "@/shared/ui/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/shadcn/dialog";
import { Input } from "@/shared/ui/shadcn/input";

const emptyForm: UpdateAdminUser = {
  login: "",
  name: "",
  email: "",
};

export default function AdminUsersPage({
  initialUsers,
  initialError,
}: {
  initialUsers: AdminUser[];
  initialError?: string;
}) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<UpdateAdminUser>(emptyForm);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState(initialError ?? "");
  const [notice, setNotice] = useState("");

  function openEditor(user: AdminUser) {
    setEditingUser(user);
    setForm({
      login: user.login,
      name: user.name,
      email: user.email,
    });
    setPassword("");
    setError("");
    setNotice("");
    setDialogOpen(true);
  }

  function openCreator() {
    setEditingUser(null);
    setForm(emptyForm);
    setPassword("");
    setError("");
    setNotice("");
    setDialogOpen(true);
  }

  async function saveUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setNotice("");
    const wasEditing = editingUser !== null;
    const payload: UpdateAdminUser = {
      ...form,
      ...(password ? { password } : {}),
    };

    try {
      const savedUser = unwrapActionResult(
        await saveAdminUserAction(editingUser?.id ?? null, payload),
        "Не удалось сохранить пользователя",
      );
      setUsers((currentUsers) =>
        wasEditing
          ? currentUsers.map((user) =>
              user.id === savedUser.id ? savedUser : user,
            )
          : [...currentUsers, savedUser],
      );
      setNotice(
        wasEditing
          ? `Данные пользователя ${savedUser.login} сохранены.`
          : `Пользователь ${savedUser.login} добавлен.`,
      );
      setDialogOpen(false);
      setEditingUser(null);
      setPassword("");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Не удалось сохранить пользователя",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteUser(user: AdminUser) {
    if (!window.confirm(`Удалить пользователя «${user.login}»?`)) return;

    setError("");
    setNotice("");
    try {
      unwrapActionResult(
        await deleteAdminUserAction(user.id),
        "Не удалось удалить пользователя",
      );
      setUsers((currentUsers) =>
        currentUsers.filter((currentUser) => currentUser.id !== user.id),
      );
      setNotice(`Пользователь ${user.login} удалён.`);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Не удалось удалить пользователя",
      );
    }
  }

  return (
    <section className="mx-auto w-full max-w-7xl space-y-6 p-2 text-foreground sm:p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Пользователи
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Управление учетными данными пользователей.
          </p>
        </div>
        <Button onClick={openCreator} className="w-full sm:w-auto">
          <Plus data-icon="inline-start" />
          Добавить пользователя
        </Button>
      </div>

      {error && !dialogOpen && (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          {error}
        </p>
      )}
      {notice && (
        <p
          role="status"
          className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
        >
          {notice}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
        {users.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            Пользователи не найдены.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Имя</th>
                  <th className="px-4 py-3 font-medium">Логин</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 text-right font-medium">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{user.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.login}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditor(user)}
                        >
                          <Pencil data-icon="inline-start" />
                          Изменить
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => void deleteUser(user)}
                        >
                          <Trash2 data-icon="inline-start" />
                          Удалить
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open && !saving) setDialogOpen(false);
          else if (open) setDialogOpen(true);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Редактирование пользователя" : "Новый пользователь"}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Пароль можно оставить пустым, чтобы не менять его. Если меняете свой логин или имя, выйдите и войдите снова, чтобы обновить сессию."
                : "Укажите имя, логин, email и пароль для новой учетной записи."}
            </DialogDescription>
          </DialogHeader>
          {error && dialogOpen && (
            <p
              role="alert"
              className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
            >
              {error}
            </p>
          )}
          <form onSubmit={saveUser} className="space-y-4">
            <label className="block space-y-1.5 text-sm">
              <span>Имя</span>
              <Input
                required
                maxLength={255}
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
              />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span>Логин</span>
              <Input
                required
                maxLength={255}
                autoComplete="username"
                value={form.login}
                onChange={(event) =>
                  setForm({ ...form, login: event.target.value })
                }
              />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span>Email</span>
              <Input
                required
                type="email"
                maxLength={255}
                autoComplete="email"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
              />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span>Пароль</span>
              <Input
                type="password"
                required={!editingUser}
                minLength={8}
                maxLength={255}
                autoComplete="new-password"
                placeholder={editingUser ? "Не менять пароль" : undefined}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            <div className="flex justify-end gap-2 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() => setDialogOpen(false)}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={saving}>
                {saving
                  ? "Сохранение..."
                  : editingUser
                    ? "Сохранить"
                    : "Создать пользователя"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
