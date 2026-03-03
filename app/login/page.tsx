"use client";

import { useState, useTransition } from "react";
import { signIn, signUp } from "./actions";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = mode === "signin"
        ? await signIn(formData)
        : await signUp(formData);

      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 3h15v13H1z" /><path d="M16 8h4l3 3v5h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900 text-[15px] tracking-tight">TransLogic</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-7">
          <div className="mb-6">
            <h1 className="text-[15px] font-semibold text-gray-900">
              {mode === "signin" ? "Вход в систему" : "Регистрация"}
            </h1>
            <p className="text-[12px] text-gray-400 mt-1">
              {mode === "signin"
                ? "Введите email и пароль для входа"
                : "Создайте учётную запись"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-gray-500 mb-1.5">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.ru"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-gray-500 mb-1.5">
                Пароль
              </label>
              <input
                name="password"
                type="password"
                required
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
              />
            </div>

            {error && (
              <p className="text-[12px] text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-[13px] font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending
                ? "Загрузка..."
                : mode === "signin" ? "Войти" : "Зарегистрироваться"}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-gray-50 text-center">
            {mode === "signin" ? (
              <p className="text-[12px] text-gray-400">
                Нет аккаунта?{" "}
                <button
                  onClick={() => { setMode("signup"); setError(null); }}
                  className="text-gray-700 font-medium hover:text-gray-900 transition-colors"
                >
                  Создать
                </button>
              </p>
            ) : (
              <p className="text-[12px] text-gray-400">
                Уже есть аккаунт?{" "}
                <button
                  onClick={() => { setMode("signin"); setError(null); }}
                  className="text-gray-700 font-medium hover:text-gray-900 transition-colors"
                >
                  Войти
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
