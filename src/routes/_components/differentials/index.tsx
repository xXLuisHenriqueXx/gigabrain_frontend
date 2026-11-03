import { Typography } from "@/components/ui/typography";

function Differentials() {
  return (
    <section
      id="differentials"
      className="flex items-center justify-center px-4 py-24"
    >
      <div className="w-full max-w-5xl space-y-12">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <Typography as="span" className="text-sm font-medium text-primary">
            WHAT YOU GET
          </Typography>

          <Typography as="h2" className="text-4xl">
            Less guesswork. <span className="text-primary">More clarity.</span>
          </Typography>

          <Typography as="p">
            Built around requirements engineering practice, not around task
            lists.
          </Typography>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3">
            <Typography as="h3" className="text-xl font-semibold">
              Structured by default
            </Typography>
            <Typography as="p">
              Statements follow EARS patterns, stories name a role, a goal and a
              benefit, and criteria use Given/When/Then.
            </Typography>
          </div>

          <div className="space-y-3">
            <Typography as="h3" className="text-xl font-semibold">
              Experts per topic
            </Typography>
            <Typography as="p">
              Each topic, such as payments or search, has an expert that keeps
              its knowledge in a file and grows as the project does.
            </Typography>
          </div>

          <div className="space-y-3">
            <Typography as="h3" className="text-xl font-semibold">
              Validated
            </Typography>
            <Typography as="p">
              A Critic scores every proposal on competencies such as ambiguity,
              completeness and verifiability, and reports what to fix.
            </Typography>
          </div>
          <div className="space-y-3">
            <Typography as="h3" className="text-xl font-semibold">
              Traceable
            </Typography>
            <Typography as="p">
              Every requirement shows how it came to be: the conversation, the experts consulted and each version.
            </Typography>
          </div>

          <div className="space-y-3">
            <Typography as="h3" className="text-xl font-semibold">
              One project at a time
            </Typography>
            <Typography as="p">
              Requirements, conversations and experts of a project stay apart from the others.
            </Typography>
          </div>

          <div className="space-y-3">
            <Typography as="h3" className="text-xl font-semibold">
              You decide
            </Typography>
            <Typography as="p">
              The system proposes and recommends. You approve, adjust or discard.
            </Typography>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Differentials;
