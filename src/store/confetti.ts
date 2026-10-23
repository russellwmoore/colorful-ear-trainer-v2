import confetti from "canvas-confetti";

const scalar = 3;
const fire = 10;

const flames = confetti.shapeFromText({ text: "🔥", scalar });
const fireworks = confetti.shapeFromText({ text: "💥", scalar });
const dead = confetti.shapeFromText({ text: "💀", scalar });

const left = {
  angle: 45,
  origin: { x: 0, y: 0.85 },
};
const right = {
  angle: 130,
  origin: { x: 1, y: 0.85 },
};

const baseOptions = {
  particleCount: 250,
  spread: 70,
  startVelocity: 75,
};

const firstMilestone = {
  ...baseOptions,
};

const secondMilestone = {
  ...baseOptions,
  scalar,
  shapes: [flames],
};

const thirdMilestone = {
  ...baseOptions,
  scalar,
  shapes: [fireworks],
};

const fourthMilestone = {
  ...baseOptions,
  scalar,
  shapes: [dead],
};

const milestones = [
  firstMilestone,
  secondMilestone,
  thirdMilestone,
  fourthMilestone,
];

export function confettiMilestone(streak: number) {
  if (streak <= 0 || streak % fire !== 0) return;

  const options = milestones[streak / fire - 1];
  if (!options) return;

  void confetti({ ...options, ...left });
  void confetti({ ...options, ...right });
}
