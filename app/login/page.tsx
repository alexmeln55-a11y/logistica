import { signIn, signUp } from "./actions";
export const dynamic = "force-dynamic";
import { signIn, signUp } from "./actions";

interface Props {
  searchParams: Promise<{ mode?: string; error?: string; confirm?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const mode = params.mode === "signup" ? "signup" : "signin";
  const error = params.error ?? null;
  const confirm = params.confirm === "1";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 3h15v13H1z" />
              <path d="M16 8h4l3 3v5h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900 text-[15px] tracking-tight">TransLogic</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-7">
          {confirm ? (
            /* Email confirmation screen */
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
                  Перейдите по ссылке, чтобы войти.
                </p>
              </div>
              <a href="/login" className="block text-[12px] text-gray-500 hover:text-gray-800 underline transition-colors">
                Вернуться ко входу
              </a>
            </div>
          ) : mode === "signin" ? (
            /* Sign In form */
            <>
              <div className="mb-6">
                <h1 className="text-[15px] font-semibold text-gray-900">Вход в систему</h1>
                <p className="text-[12px] text-gray-400 mt-1">Введите email и пароль для входа</p>
              </div>

              <form action={signIn} method="post" className="space-y-4">
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
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                  />
                </div>
                {error && (
                  <p className="text-[12px] text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {decodeURIComponent(error)}
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-[13px] font-medium hover:bg-gray-700 transition-colors"
                >
                  Войти
                </button>
              </form>

              <div className="mt-5 pt-5 border-t border-gray-50 text-center">
                <p className="text-[12px] text-gray-400">
                  Нет аккаунта?{" "}
                  <a href="/login?mode=signup" className="text-gray-700 font-medium hover:text-gray-900 transition-colors">
                    Создать
                  </a>
                </p>
              </div>
            </>
          ) : (
            /* Sign Up form */
            <>
              <div className="mb-6">
                <h1 className="text-[15px] font-semibold text-gray-900">Регистрация</h1>
                <p className="text-[12px] text-gray-400 mt-1">Создайте учётную запись</p>
              </div>

              <form action={signUp} method="post" className="space-y-4">
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
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                  />
                </div>
                {error && (
                  <p className="text-[12px] text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {decodeURIComponent(error)}
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-[13px] font-medium hover:bg-gray-700 transition-colors"
                >
                  Зарегистрироваться
                </button>
              </form>

              <div className="mt-5 pt-5 border-t border-gray-50 text-center">
                <p className="text-[12px] text-gray-400">
                  Уже есть аккаунт?{" "}
                  <a href="/login" className="text-gray-700 font-medium hover:text-gray-900 transition-colors">
                    Войти
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
