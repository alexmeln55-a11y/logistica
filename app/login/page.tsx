"use client";

import { useState } from "react";
import { login, signUp, resendVerification } from "@/app/login/actions";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [resent, setResent] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData();
    fd.set("email", email);
    fd.set("password", password);
    const result = await login(fd);
    setLoading(false);
    if (result?.error) setError(result.error);
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData();
    fd.set("email", email);
    fd.set("password", password);
    fd.set("full_name", fullName);
    const result = await signUp(fd);
    setLoading(false);
    if (result?.error) { setError(result.error); return; }
    if (result?.confirm) setConfirm(true);
  }

  async function handleResend() {
    setResent(false);
    setLoading(true);
    const fd = new FormData();
    fd.set("email", email);
    await resendVerification(fd);
    setLoading(false);
    setResent(true);
  }

  const Logo = () => (
    <div className="flex items-center gap-2.5 justify-center mb-8">
      <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 3h15v13H1z" /><path d="M16 8h4l3 3v5h-7V8z" />
          <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      </div>
      <span className="font-semibold text-gray-900 text-[15px] tracking-tight">TransLogic</span>
    </div>
  );

  if (confirm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <Logo />
          <div className="bg-white rounded-xl border border-gray-100 p-7 text-center space-y-4">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mx-auto">
              <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <h1 className="text-[15px] font-semibold text-gray-900">Проверьте почту</h1>
              <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
                Мы отправили письмо на <span className="font-medium text-gray-700">{email}</span>.<br />
                Перейдите по ссылке в письме, чтобы подтвердить email.
              </p>
            </div>
            {resent && (
              <p className="text-[12px] text-green-600 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                Письмо отправлено повторно.
              </p>
            )}
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="text-[12px] text-gray-500 hover:text-gray-800 underline transition-colors disabled:opacity-50"
            >
              {loading ? "Отправляем..." : "Отправить письмо повторно"}
            </button>
            <div className="pt-2 border-t border-gray-50">
              <button
                type="button"
                onClick={() => { setConfirm(false); setMode("signin"); setError(null); }}
                className="text-[12px] text-gray-400 hover:text-gray-700 transition-colors"
              >
                Вернуться ко входу
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Logo />
        <div className="bg-white rounded-xl border border-gray-100 p-7">
          <div className="mb-6">
            <h1 className="text-[15px] font-semibold text-gray-900">
              {mode === "signin" ? "Вход в систему" : "Регистрация"}
            </h1>
            <p className="text-[12px] text-gray-400 mt-1">
              {mode === "signin" ? "Введите email и пароль для входа" : "Создайте учётную запись"}
            </p>
          </div>

          <form onSubmit={mode === "signin" ? handleSignIn : handleSignUp} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Имя</label>
                <input
                  type="text"
                  name="full_name"
                  autoComplete="name"
                  placeholder="Иван Иванов"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="you@company.ru"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Пароль</label>
              <input
                type="password"
                name="password"
                required
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              disabled={loading}
              className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-[13px] font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Загрузка..." : mode === "signin" ? "Войти" : "Зарегистрироваться"}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-gray-50 text-center">
            {mode === "signin" ? (
              <p className="text-[12px] text-gray-400">
                Нет аккаунта?{" "}
                <button type="button" onClick={() => { setMode("signup"); setError(null); }}
                  className="text-gray-700 font-medium hover:text-gray-900 transition-colors">
                  Создать
                </button>
              </p>
            ) : (
              <p className="text-[12px] text-gray-400">
                Уже есть аккаунт?{" "}
                <button type="button" onClick={() => { setMode("signin"); setError(null); }}
                  className="text-gray-700 font-medium hover:text-gray-900 transition-colors">
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
