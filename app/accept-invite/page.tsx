"use client";

import { useState, useTransition, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { validateInviteAction, acceptInviteAction } from "./actions";
import type { AccessLevel } from "@/lib/auth/types";
import { ACCESS_LEVEL_LABELS } from "@/lib/permissions";

type ValidateState =
  | { status: "loading" }
  | { status: "valid"; email: string; fullName: string | null; position: string | null; accessLevel: AccessLevel }
  | { status: "invalid"; error: string };

const ERROR_MESSAGES: Record<string, string> = {
  not_found:    "Приглашение не найдено или ссылка недействительна.",
  expired:      "Срок действия приглашения истёк. Запросите новое приглашение у администратора.",
  already_used: "Это приглашение уже было использовано.",
  email_taken:  "Пользователь с этим email уже зарегистрирован.",
};

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [state, setState] = useState<ValidateState>({ status: "loading" });
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!token) {
      setState({ status: "invalid", error: ERROR_MESSAGES.not_found });
      return;
    }

    validateInviteAction(token).then((res) => {
      if (res.valid) {
        setState({
          status: "valid",
          email: res.email,
          fullName: res.fullName,
          position: res.position,
          accessLevel: res.accessLevel,
        });
      } else {
        setState({ status: "invalid", error: ERROR_MESSAGES[res.error] ?? "Неизвестная ошибка" });
      }
    });
  }, [token]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const fd = new FormData();
    fd.set("token", token);
    fd.set("password", password);
    fd.set("confirm", confirm);

    startTransition(async () => {
      const res = await acceptInviteAction(fd);
      if (res?.error) setFormError(res.error);
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-[20px] font-semibold text-gray-900 tracking-tight">TransLogic</span>
          <p className="text-[13px] text-gray-400 mt-1">Система управления транспортом</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-8">

          {/* Загрузка */}
          {state.status === "loading" && (
            <div className="text-center py-6">
              <div className="inline-block w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-3" />
              <p className="text-[13px] text-gray-400">Проверка приглашения…</p>
            </div>
          )}

          {/* Ошибка токена */}
          {state.status === "invalid" && (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mb-3">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-[14px] font-medium text-gray-900 mb-1">Ссылка недействительна</p>
              <p className="text-[12px] text-gray-400 leading-relaxed">{state.error}</p>
            </div>
          )}

          {/* Форма создания пароля */}
          {state.status === "valid" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-5">
                <h2 className="text-[15px] font-semibold text-gray-900 mb-0.5">Создайте пароль</h2>
                <p className="text-[12px] text-gray-400">Для завершения регистрации задайте пароль</p>
              </div>

              {/* Данные из приглашения */}
              <div className="bg-gray-50 rounded-xl p-3.5 space-y-1.5 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-gray-400">Email</span>
                  <span className="text-gray-700 font-medium">{state.email}</span>
                </div>
                {state.fullName && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Имя</span>
                    <span className="text-gray-700">{state.fullName}</span>
                  </div>
                )}
                {state.position && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Должность</span>
                    <span className="text-gray-700">{state.position}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Доступ</span>
                  <span className="text-gray-700">{ACCESS_LEVEL_LABELS[state.accessLevel]}</span>
                </div>
              </div>

              {/* Пароль */}
              <div>
                <label className="block text-[12px] font-medium text-gray-600 mb-1.5">
                  Пароль
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  disabled={isPending}
                  placeholder="Минимум 8 символов"
                  className="w-full px-3 py-2.5 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 disabled:opacity-50 placeholder-gray-300"
                />
              </div>

              {/* Повтор */}
              <div>
                <label className="block text-[12px] font-medium text-gray-600 mb-1.5">
                  Повторите пароль
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  disabled={isPending}
                  placeholder="Повторите пароль"
                  className="w-full px-3 py-2.5 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 disabled:opacity-50 placeholder-gray-300"
                />
              </div>

              {formError && (
                <p className="text-[12px] text-red-500 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-2.5 bg-gray-900 text-white text-[13px] font-medium rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 mt-2"
              >
                {isPending ? "Создание аккаунта…" : "Создать аккаунт"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
