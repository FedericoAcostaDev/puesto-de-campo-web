export interface CartOrbConfig {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  count?: number;
}

export interface CartOrb {
  size: number;
  color: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  delay: number;
}

export function createCartFeedbackOrbs({
  startX,
  startY,
  targetX,
  targetY,
  count = 10,
}: CartOrbConfig): CartOrb[] {
  const colors = ["#7dd3fc", "#7dd3fc", "#7dd3fc", "#7dd3fc"];

  return Array.from({ length: count }, (_, index) => {
    const size = Math.random() * 12 + 10;
    const color = colors[index % colors.length];
    const driftX = (targetX - startX) * (0.35 + Math.random() * 0.25);
    const driftY = (targetY - startY) * (0.35 + Math.random() * 0.25);

    return {
      size,
      color,
      startX,
      startY,
      targetX: targetX - driftX,
      targetY: targetY - driftY,
      delay: index * 18,
    };
  });
}

export function triggerHapticFeedback(pattern: number | number[] = 12) {
  if (typeof window !== "undefined" && typeof window.navigator?.vibrate === "function") {
    window.navigator.vibrate(pattern);
  }
}

export function triggerCartFeedback(
  clientX: number,
  clientY: number,
  targetSelector = '[data-cart-trigger]',
) {
  triggerHapticFeedback([8, 12, 8]);

  const target = document.querySelector<HTMLElement>(targetSelector);
  const rect = target?.getBoundingClientRect();

  const targetX = rect
    ? rect.left + rect.width / 2
    : window.innerWidth - 40;
  const targetY = rect ? rect.top + rect.height / 2 : 28;

  const orbs = createCartFeedbackOrbs({
    startX: clientX,
    startY: clientY,
    targetX,
    targetY,
    count: 9,
  });

  orbs.forEach((orb, index) => {
    const particle = document.createElement("span");
    const size = `${orb.size}px`;

    particle.style.width = size;
    particle.style.height = size;
    particle.style.background = `radial-gradient(circle, ${orb.color} 0%, rgba(125, 211, 252, 0.15) 70%, rgba(125, 211, 252, 0) 100%)`;
    particle.style.position = "fixed";
    particle.style.borderRadius = "9999px";
    particle.style.pointerEvents = "none";
    particle.style.zIndex = "9999";
    particle.style.left = `${orb.startX}px`;
    particle.style.top = `${orb.startY}px`;
    particle.style.opacity = "0.95";
    particle.style.filter = "blur(0.5px)";

    const deltaX = orb.targetX - orb.startX;
    const deltaY = orb.targetY - orb.startY;

    particle.animate(
      [
        {
          transform: "translate(-50%, -50%) scale(1)",
          opacity: 0.95,
          filter: "blur(0px)",
        },
        {
          transform: `translate(calc(-50% + ${deltaX * 0.6}px), calc(-50% + ${deltaY * 0.6}px)) scale(0.75)`,
          opacity: 0.7,
          filter: "blur(1px)",
        },
        {
          transform: `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px)) scale(0)`,
          opacity: 0,
          filter: "blur(2px)",
        },
      ],
      {
        duration: 950,
        delay: orb.delay,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "forwards",
      },
    );

    document.body.appendChild(particle);
    window.setTimeout(() => particle.remove(), 1030 + orb.delay);
  });
}
