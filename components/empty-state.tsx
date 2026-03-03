export function EmptyState({
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

function SparkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2l1.2 4.2L17 7.4l-3.8 1.2L12 13l-1.2-4.4L7 7.4l3.8-1.2L12 2z" />
      <path d="M19 13l.8 2.8L22 17l-2.2.7L19 20l-.8-2.3L16 17l2.2-1.2L19 13z" />
      <path d="M4 13l.8 2.8L7 17l-2.2.7L4 20l-.8-2.3L1 17l2.2-1.2L4 13z" />
    </svg>
  );
}
