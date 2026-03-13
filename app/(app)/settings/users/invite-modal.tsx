"use client";

import { useState, useTransition, useRef } from "react";
import { inviteUser } from "./actions";
import { ACCESS_LEVEL_LABELS } from "@/lib/permissions";
import type { UserRole, AccessLevel } from "@/lib/auth/types";

interface Props {
  currentRole: UserRole;
}

export function InviteModal({ currentRole }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const accessLevels: AccessLevel[] =
    currentRole === "owner"
      ? ["full_access", "view_all", "custom"]
      : ["view_all", "custom"];

  function handleOpen() {
    setOpen(true);
    setError(null);
    setSuccess(false);
  }

  function handleClose() {
    if (isPending) return;
    setOpen(false);
    setError(null);
    setSuccess(false);
    formRef.current?.reset();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await inviteUser(fd);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        formRef.current?.reset();
      }
    });
  }

  return (
    <>
      {/* Кнопка открытия */}
      <button
        onClick={handleOpen}
        className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-900 text-white text-[13px] font-medium rounded-lg hover:bg-gray-700 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Пригласить
      </button>

      {/* Оверлей */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-[14px] font-semibold text-gray-900">Пригласить пользователя</h3>
              <button
                onClick={handleClose}
                disabled={isPending}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              {success ? (
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-50 rounded-full mb-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-[14px] font-medium text-gray-900 mb-1">Приглашение отправлено</p>
                  <p className="text-[12px] text-gray-400 mb-5">
                    Пользователь получит письмо со ссылкой для создания аккаунта
                  </p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => { setSuccess(false); setError(null); }}
                      className="px-4 py-2 text-[13px] border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Пригласить ещё
                    </button>
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 text-[13px] bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Закрыть
                    </button>
                  </div>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className="block text-[12px] font-medium text-gray-600 mb-1.5">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      disabled={isPending}
                      placeholder="user@company.com"
                      className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 disabled:opacity-50 placeholder-gray-300"
                    />
                  </div>

                  {/* Имя */}
                  <div>
                    <label className="block text-[12px] font-medium text-gray-600 mb-1.5">
                      Полное имя
                    </label>
                    <input
                      name="full_name"
                      type="text"
                      disabled={isPending}
                      placeholder="Иван Иванов"
                      className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 disabled:opacity-50 placeholder-gray-300"
                    />
                  </div>

                  {/* Должность */}
                  <div>
                    <label className="block text-[12px] font-medium text-gray-600 mb-1.5">
                      Должность
                    </label>
                    <input
                      name="position"
                      type="text"
                      disabled={isPending}
                      placeholder="Менеджер по логистике"
                      className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 disabled:opacity-50 placeholder-gray-300"
                    />
                  </div>

                  {/* Уровень доступа */}
                  <div>
                    <label className="block text-[12px] font-medium text-gray-600 mb-1.5">
                      Уровень доступа
                    </label>
                    <select
                      name="access_level"
                      defaultValue="view_all"
                      disabled={isPending}
                      className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 disabled:opacity-50"
                    >
                      {accessLevels.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {ACCESS_LEVEL_LABELS[lvl]}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Полный доступ даёт права на все разделы системы.
                    </p>
                  </div>

                  {error && (
                    <p className="text-[12px] text-red-500 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
                      {error}
                    </p>
                  )}

                  {/* Кнопки */}
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={isPending}
                      className="flex-1 px-4 py-2.5 text-[13px] border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="flex-1 px-4 py-2.5 text-[13px] bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      {isPending ? "Отправка…" : "Отправить приглашение"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
