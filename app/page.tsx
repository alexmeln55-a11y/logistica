"use client";

import { useState } from "react";

type Section = "transport" | "settings";
type SettingsTab = "organization" | "users" | "departments";

export default function Home() {
  const [section, setSection] = useState<Section>("transport");
  const [settingsTab, setSettingsTab] = useState<SettingsTab>("organization");
  const [transportExpanded, setTransportExpanded] = useState(true);
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [accountExpanded, setAccountExpanded] = useState(true);

  const openSettings = (tab: SettingsTab) => {
    setSection("settings");
    setSettingsTab(tab);
    setSettingsExpanded(true);
    setAccountExpanded(true);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-sm text-gray-800 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 flex flex-col bg-white border-r border-gray-100 shrink-0">
        {/* Logo */}
        <div className="h-14 flex items-center px-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
              <TruckIcon className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-[13px] tracking-tight">TransLogic</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {/* Transport folder */}
          <button
            onClick={() => {
              setTransportExpanded((v) => !v);
              setSection("transport");
            }}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors ${
              section === "transport"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <FolderIcon className="w-4 h-4 text-gray-400" />
              Транспорт
            </span>
            <ChevronIcon className={`w-3.5 h-3.5 text-gray-400 transition-transform ${transportExpanded ? "rotate-90" : ""}`} />
          </button>

          {transportExpanded && (
            <div className="ml-4 mt-0.5 px-2.5 py-2 rounded-md border border-dashed border-gray-200 bg-gray-50/60">
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Модули транспорта будут добавлены позже.
              </p>
            </div>
          )}
        </nav>

        {/* Settings at bottom */}
        <div className="px-3 pb-4 border-t border-gray-100 pt-3">
          <button
            onClick={() => {
              setSettingsExpanded((v) => !v);
              setSection("settings");
            }}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors ${
              section === "settings"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <SettingsIcon className="w-4 h-4 text-gray-400" />
              Настройки
            </span>
            <ChevronIcon className={`w-3.5 h-3.5 text-gray-400 transition-transform ${settingsExpanded ? "rotate-90" : ""}`} />
          </button>

          {settingsExpanded && (
            <div className="ml-4 mt-0.5 space-y-0.5">
              <button
                onClick={() => setAccountExpanded((v) => !v)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-[12px] font-medium transition-colors ${
                  section === "settings"
                    ? "text-gray-700 hover:bg-gray-50"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <UserCircleIcon className="w-3.5 h-3.5 text-gray-400" />
                  Личный кабинет
                </span>
                <ChevronIcon className={`w-3.5 h-3.5 text-gray-400 transition-transform ${accountExpanded ? "rotate-90" : ""}`} />
              </button>

              {accountExpanded && (
                <div className="ml-4 mt-0.5 space-y-0.5">
                  <button
                    onClick={() => openSettings("organization")}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] transition-colors ${
                      section === "settings" && settingsTab === "organization"
                        ? "text-gray-900 bg-gray-100"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    <BuildingIcon className="w-3.5 h-3.5" />
                    Организация
                  </button>
                  <button
                    onClick={() => openSettings("users")}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] transition-colors ${
                      section === "settings" && settingsTab === "users"
                        ? "text-gray-900 bg-gray-100"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    <UsersIcon className="w-3.5 h-3.5" />
                    Пользователи
                  </button>
                  <button
                    onClick={() => openSettings("departments")}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] transition-colors ${
                      section === "settings" && settingsTab === "departments"
                        ? "text-gray-900 bg-gray-100"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    <DepartmentIcon className="w-3.5 h-3.5" />
                    Отделы компании
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-14 flex items-center justify-between px-6 bg-white border-b border-gray-100 shrink-0">
          <div>
            <h1 className="text-[15px] font-semibold text-gray-900">
              {section === "transport"
                ? "Транспорт"
                : settingsTab === "organization"
                  ? "Организация"
                  : settingsTab === "users"
                    ? "Пользователи"
                    : "Отделы компании"}
            </h1>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {section === "transport" ? "Транспорт" : "Настройки / Личный кабинет"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center">
              <span className="text-white text-[10px] font-semibold">АС</span>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-[12px] font-medium text-gray-900">Алексей Смирнов</p>
              <p className="text-[11px] text-gray-400">Администратор</p>
            </div>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-6">
          {section === "transport" && (
            <EmptyState
              title="Папка «Транспорт» пустая"
              description="Добавим сюда рейсы, парк ТС, водителей и диспетчеризацию."
              actionLabel="Добавить модуль"
            />
          )}
          {section === "settings" && settingsTab === "organization" && (
            <EmptyState
              title="Организация"
              description="Данные организации удалены. Здесь будут реквизиты, адреса и документы."
              actionLabel="Добавить данные"
            />
          )}
          {section === "settings" && settingsTab === "users" && (
            <EmptyState
              title="Пользователи"
              description="Список пользователей удалён. Здесь будут роли, доступы и приглашения."
              actionLabel="Пригласить"
            />
          )}
          {section === "settings" && settingsTab === "departments" && (
            <EmptyState
              title="Отделы компании"
              description="Список отделов удалён. Здесь будет структура компании и назначение руководителей."
              actionLabel="Создать отдел"
            />
          )}
        </div>
      </main>
    </div>
  );
}

function EmptyState({
  title,
  description,
  actionLabel,
}: {
  title: string;
  description: string;
  actionLabel: string;
}) {
  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
            <SparkIcon className="w-5 h-5 text-gray-400" />
          </div>
          <div className="min-w-0">
            <h2 className="text-[13px] font-semibold text-gray-900">{title}</h2>
            <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">{description}</p>
            <div className="mt-4">
              <button className="text-[12px] font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors">
                {actionLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Inline SVG icons ──────────────────────────────────────────────────────────

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 3h15v13H1z" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function DepartmentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="6" height="10" rx="1" /><rect x="9" y="3" width="6" height="4" rx="1" /><rect x="16" y="7" width="6" height="10" rx="1" /><path d="M5 7V5a1 1 0 011-1h12a1 1 0 011 1v2" /><line x1="12" y1="7" x2="12" y2="17" />
    </svg>
  );
}

function RouteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="19" r="3" /><path d="M9 19h8.5a3.5 3.5 0 000-7h-11a3.5 3.5 0 010-7H15" /><circle cx="18" cy="5" r="3" />
    </svg>
  );
}

function UserCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 20a6 6 0 018-12" opacity="0" />
      <path d="M8 19.5a8 8 0 018 0" />
      <path d="M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function SparkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l1.2 4.2L17 7.4l-3.8 1.2L12 13l-1.2-4.4L7 7.4l3.8-1.2L12 2z" />
      <path d="M19 13l.8 2.8L22 17l-2.2.7L19 20l-.8-2.3L16 17l2.2-1.2L19 13z" />
      <path d="M4 13l.8 2.8L7 17l-2.2.7L4 20l-.8-2.3L1 17l2.2-1.2L4 13z" />
    </svg>
  );
}
