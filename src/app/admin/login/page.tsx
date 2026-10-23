import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { adminConfigured, isAdminAuthed } from "@/lib/admin-auth";
import { LoginForm } from "./login-form";
import { AnchorMark } from "@/components/logo";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string }>;
}) {
  if (await isAdminAuthed()) {
    redirect("/admin");
  }
  const configured = adminConfigured();
  const params = await searchParams;

  return (
    <section className="bg-ivory-50 py-20 lg:py-28">
      <Container className="flex flex-col items-center">
        <span className="grid h-14 w-14 place-items-center rounded-full border border-navy-900/25 text-navy-900">
          <AnchorMark className="h-7 w-7" />
        </span>
        <h1 className="mt-6 font-display text-3xl text-navy-900">
          Admin sign in
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          Restricted to Exuma Yacht Club staff.
        </p>
        {params.reset === "1" && (
          <p
            role="status"
            className="mt-6 max-w-sm border border-green-700/30 bg-green-50 p-4 text-center text-sm text-green-900"
          >
            Password updated. Sign in with your new password.
          </p>
        )}
        {configured ? (
          <LoginForm />
        ) : (
          <p
            role="alert"
            className="mt-8 max-w-sm border border-[#e3c2bb] bg-[#fbf1ef] p-5 text-center text-sm text-[#8f3526]"
          >
            The admin area is disabled because ADMIN_PASSWORD and
            ADMIN_SESSION_SECRET are not both configured. Configure them in your
            environment to enable access.
          </p>
        )}
      </Container>
    </section>
  );
}
