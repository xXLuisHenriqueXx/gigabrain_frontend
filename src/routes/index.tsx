import { createFileRoute } from "@tanstack/react-router";

import Hero from "./_components/hero";
import About from "./_components/about";
import Methodology from "./_components/methodology";
import Architecture from "./_components/architecture";
import Differentials from "./_components/differentials";
import CTA from "./_components/cta";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="relative flex min-w-full flex-col overflow-x-hidden">
      <Hero />
      <About />
      <Methodology />
      <Architecture />
      <Differentials />
      <CTA />
    </main>
  );
}
