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
          From a loose idea to{" "}
          <span className="text-primary">well-defined requirements</span>.
        </Typography>

        <Typography as="p" className="mx-auto max-w-2xl text-lg">
          Requirements rarely arrive clean. They are scattered across
          conversations, vague, and sometimes contradict each other. Writing
          them down well takes time that Product Owners seldom have.
        </Typography>

        <Typography as="p" className="mx-auto max-w-2xl">
          GigaBrain asks the questions that are missing and proposes each
          requirement as a "shall" statement, a user story and Given/When/Then
          criteria. It works only with what you say and the documents you
          provide: it never reads source code.
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
