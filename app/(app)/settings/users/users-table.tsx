"use client";

import { useState, useTransition } from "react";
import {
  updateAccessLevel,
  updateUserRole,
  deactivateUser,
  activateUser,
} from "./actions";
import { ACCESS_LEVEL_LABELS, canChangeAccess } from "@/lib/permissions";
import type { UserListRow, UserRole, AccessLevel, CurrentUser } from "@/lib/auth/types";

const ROLE_LABELS: Record<UserRole, string> = {
  owner:   "Владелец",
  admin:   "Администратор",
  manager: "Менеджер",
};

const ACCESS_BADGE: Record<AccessLevel, string> = {
  full_access: "bg-green-50 text-green-700 border-green-200",
  view_all:    "bg-blue-50 text-blue-700 border-blue-200",
  custom:      "bg-gray-50 text-gray-600 border-gray-200",
};

const STATUS_DOT: Record<string, string> = {
  active:   "bg-green-400",
  inactive: "bg-gray-300",
};

interface Props {
  users: UserListRow[];
  currentUserId: string;
  currentRole: UserRole;
}

export function UsersTable({ users, currentUserId, currentRole }: Props) {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentAsActor = {
    id: currentUserId,
    role: currentRole,
    can_manage_users: currentRole === "owner" || currentRole === "admin",
  } as CurrentUser;

  function setError(key: string, msg: string) {
    setErrors((prev) => ({ ...prev, [key]: msg }));
    setTimeout(() => setErrors((prev) => { const next = { ...prev }; delete next[key]; return next; }), 4000);
  }

  function handleAccessChange(userId: string, val: AccessLevel) {
    startTransition(async () => {
      const res = await updateAccessLevel(userId, val);
      if (res?.error) setError(`access-${userId}`, res.error);
    });
  }

  function handleRoleChange(userId: string, val: UserRole) {
    startTransition(async () => {
      const res = await updateUserRole(userId, val);
      if (res?.error) setError(`role-${userId}`, res.error);
    });
  }

  function handleToggle(userId: string, isActive: boolean) {
    startTransition(async () => {
      const res = isActive
        ? await deactivateUser(userId)
        : await activateUser(userId);
      if (res?.error) setError(`toggle-${userId}`, res.error);
    });
  }

  const accessLevels: AccessLevel[] = ["full_access", "view_all", "custom"];
  const roles: UserRole[] = ["owner", "admin", "manager"];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/60">
            <th className="px-4 py-3 text-left font-medium text-gray-500 w-6">#</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Сотрудник</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Должность</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Доступ</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Роль</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Статус</th>
            <th className="px-4 py-3 text-right font-medium text-gray-500">Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => {
            const isSelf = user.id === currentUserId;
            const canEdit = canChangeAccess(currentAsActor, user.role) && !isSelf;
            const errAccess = errors[`access-${user.id}`];
            const errRole   = errors[`role-${user.id}`];
            const errToggle = errors[`toggle-${user.id}`];

            return (
              <tr
                key={user.id}
                className={`border-b border-gray-50 last:border-0 transition-colors ${
                  !user.is_active ? "opacity-50" : "hover:bg-gray-50/40"
                }`}
              >
                {/* # */}
                <td className="px-4 py-3.5 text-gray-300 font-mono text-[11px]">{i + 1}</td>

                {/* Сотрудник */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center text-[11px] font-semibold text-gray-500 shrink-0">
                      {(user.full_name || user.email)[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-gray-800 truncate">
                        {user.full_name || <span className="text-gray-400 font-normal">—</span>}
                        {isSelf && (
                          <span className="ml-1.5 text-[10px] text-gray-400 font-normal">(вы)</span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-400 truncate">{user.email}</div>
                    </div>
                  </div>
                </td>

                {/* Должность */}
                <td className="px-4 py-3.5 text-gray-500">
                  {user.position || <span className="text-gray-300">—</span>}
                </td>

                {/* Доступ */}
                <td className="px-4 py-3.5">
                  {canEdit ? (
                    <div>
                      <select
                        defaultValue={user.access_level}
                        disabled={isPending}
                        onChange={(e) =>
                          handleAccessChange(user.id, e.target.value as AccessLevel)
                        }
                        className="text-[12px] border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 disabled:opacity-50"
                      >
                        {accessLevels.map((lvl) => (
                          <option key={lvl} value={lvl}>
                            {ACCESS_LEVEL_LABELS[lvl]}
                          </option>
                        ))}
                      </select>
                      {errAccess && (
                        <p className="text-[11px] text-red-500 mt-0.5">{errAccess}</p>
                      )}
                    </div>
                  ) : (
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${ACCESS_BADGE[user.access_level]}`}
                    >
                      {ACCESS_LEVEL_LABELS[user.access_level]}
                    </span>
                  )}
                </td>

                {/* Роль */}
                <td className="px-4 py-3.5">
                  {canEdit && currentRole === "owner" ? (
                    <div>
                      <select
                        defaultValue={user.role}
                        disabled={isPending}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value as UserRole)
                        }
                        className="text-[12px] border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 disabled:opacity-50"
                      >
                        {roles.map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABELS[r]}
                          </option>
                        ))}
                      </select>
                      {errRole && (
                        <p className="text-[11px] text-red-500 mt-0.5">{errRole}</p>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-600">{ROLE_LABELS[user.role]}</span>
                  )}
                </td>

                {/* Статус */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        user.is_active ? STATUS_DOT.active : STATUS_DOT.inactive
                      }`}
                    />
                    <span className="text-gray-500">
                      {user.is_active ? "Активен" : "Отключён"}
                    </span>
                    {!user.email_verified && (
                      <span className="ml-1 text-[10px] text-amber-500 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-full">
                        не подтверждён
                      </span>
                    )}
                  </div>
                </td>

                {/* Действия */}
                <td className="px-4 py-3.5 text-right">
                  {canEdit && (
                    <div>
                      <button
                        disabled={isPending}
                        onClick={() => handleToggle(user.id, user.is_active)}
                        className={`text-[12px] px-3 py-1.5 rounded-md border font-medium transition-colors disabled:opacity-40 ${
                          user.is_active
                            ? "border-red-100 text-red-500 hover:bg-red-50"
                            : "border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {user.is_active ? "Деактивировать" : "Активировать"}
                      </button>
                      {errToggle && (
                        <p className="text-[11px] text-red-500 mt-0.5 text-right">{errToggle}</p>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}

          {users.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center text-[13px] text-gray-400">
                Пользователи не найдены
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
