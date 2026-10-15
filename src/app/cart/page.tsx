import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review the items in your Exuma Yacht Club gift shop cart.",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <section className="py-14 lg:py-20">
      <Container>
        <p className="overline-label">Gift Shop</p>
        <h1 className="mt-3 font-display text-4xl text-navy-900">Your cart</h1>
        <div className="mt-10">
          <CartView />
        </div>
      </Container>
    </section>
  );
}
