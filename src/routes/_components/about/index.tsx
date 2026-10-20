import { Typography } from "@/components/ui/typography";

import AIGen from "@/assets/ai_gen.svg";

function About() {
  return (
    <section
      id="about"
      className="flex flex-col md:flex-row items-center justify-center gap-16 px-4 py-28"
    >
      <div className="w-full max-w-4xl space-y-4 text-center md:text-start">
        <Typography as="h2" className="mx-auto max-w-2xl text-4xl">
          From idea to{" "}
          <span className="text-primary">well-defined software</span>.
        </Typography>

        <Typography as="p" className="mx-auto max-w-2xl text-lg">
          Building software involves much more than writing code. Product
          decisions, requirements, prioritization, and communication can quickly
          become a source of unnecessary complexity.
        </Typography>

        <Typography as="p" className="mx-auto max-w-2xl">
          Our assistant helps turn ideas into structured, actionable product
          requirements, giving development teams more clarity and less
          repetitive work.
        </Typography>
      </div>

      <div className="relative flex items-center justify-center max-w-xl">
        <div className="absolute size-64 rounded-full bg-muted/50 animate-pulse blur-3xl -z-1"></div>
        <img src={AIGen} alt="" />
      </div>
    </section>
  );
}

export default About;
