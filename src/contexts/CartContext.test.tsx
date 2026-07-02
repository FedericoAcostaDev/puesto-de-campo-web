import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CartProvider, useCart } from "@/contexts/CartContext";
import { getPurchaseSelection } from "@/lib/purchase";

function TestConsumer() {
  const { items, addToCart } = useCart();

  const product = {
    id: "p1",
    slug: "p1",
    name: "Carne",
    description: "Test",
    price: 1200,
    image: "/test.png",
    category: "Vacuno",
    weight: "1 kg",
    saleType: "weight",
  };

  return (
    <div>
      <button
        onClick={() => {
          addToCart(product, getPurchaseSelection(product, 0.5));
        }}
      >
        add
      </button>
      <pre data-testid="items">{JSON.stringify(items)}</pre>
    </div>
  );
}

describe("CartContext", () => {
  it("stores the selected purchase amount and label for weight products", () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /add/i }));

    expect(screen.getByTestId("items").textContent).toContain("0.5");
    expect(screen.getByTestId("items").textContent).toContain("500 g");
  });
});
