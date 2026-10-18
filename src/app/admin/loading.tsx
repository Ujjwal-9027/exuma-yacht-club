import { LoaderCircle } from "lucide-react";

export default function AdminLoading() {
  return (
    <div
      className="grid min-h-[70vh] place-items-center bg-[#f4f3ef] px-6"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full border border-gold-500/60 text-gold-600">
          <LoaderCircle
            className="h-6 w-6 animate-spin"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-400">
          Loading admin panel
        </span>
      </div>
    </div>
  );
}
