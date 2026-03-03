"use client";

import { useState } from "react";
import { useActionState } from "react";
import { signIn, signUp } from "./actions";

type ActionState = { error?: string; confirm?: boolean } | null;

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const [signInState, signInAction, signInPending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      const result = await signIn(formData);
      return result ?? null;
    },
    null
  );

  const [signUpState, signUpAction, signUpPending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      const result = await signUp(formData);
      return result ?? null;
    },
    null
  );

  const isPending = signInPending || signUpPending;
  const error = mode === "signin" ? signInState?.error : signUpState?.error;
  const showConfirm = signUpState?.confirm;

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
          {showConfirm ? (
            // Email confirmation message
            <div className="space-y-4 text-center">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mx-auto">
                <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <h1 className="text-[15px] font-semibold text-gray-900">Проверьте почту</h1>
                <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
                  Мы отправили письмо с подтверждением.<br />
                  Перейдите по ссылке в письме, чтобы войти.
                </p>
              </div>
              <button
                onClick={() => setMode("signin")}
                className="text-[12px] text-gray-500 hover:text-gray-800 underline transition-colors"
              >
                Вернуться ко входу
              </button>
            </div>
          ) : (
            <>
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

              {/* Sign In form */}
              {mode === "signin" && (
                <form action={signInAction} className="space-y-4">
                  <Fields autoComplete="current-password" />
                  {signInState?.error && <ErrorMessage message={signInState.error} />}
                  <SubmitButton pending={signInPending} label="Войти" />
                </form>
              )}

              {/* Sign Up form */}
              {mode === "signup" && (
                <form action={signUpAction} className="space-y-4">
                  <Fields autoComplete="new-password" />
                  {signUpState?.error && <ErrorMessage message={signUpState.error} />}
                  <SubmitButton pending={signUpPending} label="Зарегистрироваться" />
                </form>
              )}

              <div className="mt-5 pt-5 border-t border-gray-50 text-center">
                {mode === "signin" ? (
                  <p className="text-[12px] text-gray-400">
                    Нет аккаунта?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("signup")}
                      className="text-gray-700 font-medium hover:text-gray-900 transition-colors"
                    >
                      Создать
                    </button>
                  </p>
                ) : (
                  <p className="text-[12px] text-gray-400">
                    Уже есть аккаунт?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("signin")}
                      className="text-gray-700 font-medium hover:text-gray-900 transition-colors"
                    >
                      Войти
                    </button>
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function Fields({ autoComplete }: { autoComplete: string }) {
  return (
    <>
      <div>
        <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Email</label>
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
        <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Пароль</label>
        <input
          name="password"
          type="password"
          required
          autoComplete={autoComplete}
          placeholder="••••••••"
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
        />
      </div>
    </>
  );
}

function SubmitButton({ pending, label }: { pending: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-[13px] font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? "Загрузка..." : label}
    </button>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <p className="text-[12px] text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
      {message}
    </p>
  );
}
