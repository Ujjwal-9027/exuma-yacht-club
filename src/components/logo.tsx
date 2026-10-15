import Image from "next/image";

export function AnchorMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="16" cy="6.5" r="3" />
      <path d="M16 9.5v16.5" />
      <path d="M10.5 13.5h11" />
      <path d="M5.5 20v-2.5M26.5 20v-2.5" />
      <path d="M5.5 19.5c0 5.2 4.2 7.8 10.5 8.7 6.3-.9 10.5-3.5 10.5-8.7" />
    </svg>
  );
}

export function Logo({
  variant = "dark",
  compact = false,
}: {
  variant?: "dark" | "light";
  compact?: boolean;
}) {
  const text = variant === "dark" ? "text-navy-900" : "text-ivory-50";
  const sub = variant === "dark" ? "text-gold-600" : "text-gold-400";
  return (
    <span className="inline-flex items-center gap-3">
      <Image
        src="/logo/EYC-logo.png"
        alt=""
        aria-hidden="true"
        width={compact ? 90 : 42}
        height={compact ? 90 : 42}
        priority
        unoptimized
        className={`shrink-0 rounded-md border border-ivory-50/30 object-cover ${compact ? "h-[90px] w-[90px]" : "h-10 w-10"}`}
      />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display ${compact ? "text-[15px]" : "text-[17px]"} font-semibold tracking-[0.14em] ${text}`}
        >
          EXUMA YACHT CLUB
        </span>
        <span
          className={`mt-1 text-[9px] font-semibold uppercase tracking-[0.3em] ${sub}`}
        >
          George Town · Bahamas
        </span>
      </span>
    </span>
  );
}
