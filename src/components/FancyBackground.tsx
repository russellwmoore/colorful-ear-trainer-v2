import { useEartrainerStore } from "@/store/store";

export function FancyBackground() {
  const correctStreak = useEartrainerStore((s) => s.correctStreak);
  const backgoundColors = useEartrainerStore((s) => s.backgroundColors);

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(to right, ${backgoundColors.join(", ")})`,
        opacity: correctStreak / 10,
      }}
      className="absolute inset-0 -z-10"
    ></div>
  );
}
