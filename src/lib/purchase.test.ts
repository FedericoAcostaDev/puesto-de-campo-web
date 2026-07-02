import { describe, expect, it } from "vitest";
import { getPurchaseMode } from "./purchase";

describe("getPurchaseMode", () => {
  it("treats condimentos as unit sales", () => {
    expect(
      getPurchaseMode({
        category: "Condimentos",
        name: "Ají molido",
        saleType: "",
      }),
    ).toBe("unit");
  });

  it("treats leña y carbon as unit sales", () => {
    expect(
      getPurchaseMode({
        category: "Leña y carbon",
        name: "Leña",
        saleType: "",
      }),
    ).toBe("unit");
  });

  it("treats pollo entero as a unit sale with pending pricing", () => {
    expect(
      getPurchaseMode({
        category: "Pollo",
        name: "Pollo entero",
        saleType: "",
      }),
    ).toBe("unit");
  });
});
