import { beforeEach, describe, expect, it, vi } from "vitest";
import { createCartFeedbackOrbs, triggerHapticFeedback } from "./cartFeedback";

describe("createCartFeedbackOrbs", () => {
  it("creates blue orbs that travel toward the cart target", () => {
    const orbs = createCartFeedbackOrbs({
      startX: 120,
      startY: 80,
      targetX: 320,
      targetY: 40,
      count: 4,
    });

    expect(orbs).toHaveLength(4);
    orbs.forEach((orb) => {
      expect(orb.color).toContain("#7dd3fc");
      expect(orb.startX).toBe(120);
      expect(orb.startY).toBe(80);
      expect(orb.targetX).toBeGreaterThan(120);
      expect(orb.targetY).toBeLessThan(80);
      expect(orb.size).toBeGreaterThan(0);
    });
  });
});

describe("triggerHapticFeedback", () => {
  beforeEach(() => {
    Object.defineProperty(window.navigator, "vibrate", {
      configurable: true,
      value: vi.fn(),
    });
  });

  it("calls navigator.vibrate when the browser supports it", () => {
    const vibrate = vi.fn();
    Object.defineProperty(window.navigator, "vibrate", {
      configurable: true,
      value: vibrate,
    });

    triggerHapticFeedback([10, 30, 10]);

    expect(vibrate).toHaveBeenCalledWith([10, 30, 10]);
  });
});
