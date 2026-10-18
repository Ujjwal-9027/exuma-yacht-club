import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Place your Exuma Yacht Club gift shop order — pay securely with PayPal or debit or credit card.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <section className="py-14 lg:py-20">
      <Container>
        <p className="overline-label">Gift Shop</p>
        <h1 className="mt-3 font-display text-4xl text-navy-900">Checkout</h1>
        <div className="mt-10">
          <CheckoutForm />
        </div>
      </Container>
    </section>
  );
}
