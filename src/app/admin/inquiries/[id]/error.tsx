"use client";

export default function InquiryDetailError({ reset }: { reset: () => void }) {
  return (
    <div
      className="border border-[#e3c2bb] bg-[#fbf1ef] p-8 text-sm text-[#8f3526]"
      role="alert"
    >
      <h2 className="font-display text-2xl">Inquiry could not be loaded</h2>
      <p className="mt-2">Refresh the page or try again in a moment.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-5 border border-[#8f3526] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em]"
      >
        Try again
      </button>
    </div>
  );
}
