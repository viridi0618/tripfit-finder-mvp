import type { Metadata } from "next";
import { TripFinder } from "../components/TripFinder";

export const metadata: Metadata = {
  title: "Where Should I Travel Quiz",
  description:
    "A lightweight vacation destination quiz that still checks passport, origin, total trip budget, and trip length.",
  alternates: { canonical: "/quiz" },
};

export default function QuizPage() {
  return (
    <main>
      <section className="page-hero compact">
        <p className="eyebrow">Vacation destination quiz</p>
        <h1>Where Should I Travel Quiz</h1>
        <p>
          Pick a travel mood, then get realistic destinations using the same
          feasibility engine as the main random vacation generator.
        </p>
      </section>
      <TripFinder quizMode />
    </main>
  );
}
