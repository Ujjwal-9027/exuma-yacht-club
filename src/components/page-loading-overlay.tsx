import { LoaderCircle } from "lucide-react";

export function PageLoadingOverlay() {
  return (
    <div
      className="fixed inset-0 z-[100] grid min-h-dvh place-items-center bg-ivory-50 px-6"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full border border-gold-500/60 text-gold-600">
          <LoaderCircle
            className="h-7 w-7 animate-spin motion-reduce:animate-none"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-400">
          Loading Exuma Yacht Club
        </span>
      </div>
    </div>
  );
}
