"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { verifyEmailAction } from "./actions";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await verifyEmailAction(token);
      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
        const messages: Record<string, string> = {
          not_found: "Ссылка недействительна или уже была использована.",
          expired: "Срок действия ссылки истёк. Запросите новое письмо.",
          already_used: "Email уже подтверждён с помощью этой ссылки.",
        };
        setErrorMsg(messages[result.error] ?? "Неизвестная ошибка.");
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

        <div className="bg-white rounded-xl border border-gray-100 p-7 text-center space-y-5">

          {status === "idle" && (
            <>
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <h1 className="text-[15px] font-semibold text-gray-900">Подтверждение email</h1>
                <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
                  Нажмите кнопку ниже, чтобы подтвердить ваш адрес электронной почты.
                </p>
              </div>
              {!token && (
                <p className="text-[12px] text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  Токен не найден. Убедитесь, что ссылка из письма скопирована полностью.
                </p>
              )}
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!token || isPending}
                className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-[13px] font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? "Проверяем..." : "Подтвердить email"}
              </button>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mx-auto">
                <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <h1 className="text-[15px] font-semibold text-gray-900">Email подтверждён</h1>
                <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
                  Теперь вы можете войти в систему.
                </p>
              </div>
              <a
                href="/login"
                className="inline-block w-full bg-gray-900 text-white rounded-lg py-2.5 text-[13px] font-medium hover:bg-gray-700 transition-colors"
              >
                Войти
              </a>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <div>
                <h1 className="text-[15px] font-semibold text-gray-900">Не удалось подтвердить</h1>
                <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">{errorMsg}</p>
              </div>
              <a
                href="/login"
                className="inline-block text-[12px] text-gray-500 hover:text-gray-800 underline transition-colors"
              >
                Вернуться ко входу
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
