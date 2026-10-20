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
            DIFFERENTIALS
          </Typography>

          <Typography as="h2" className="text-4xl">
            Less overhead. <span className="text-primary">More clarity.</span>
          </Typography>

          <Typography as="p">
            Designed to support product thinking without adding another layer of
            unnecessary complexity to your workflow.
          </Typography>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3">
            <Typography as="h3" className="text-xl font-semibold">
              Product-focused
            </Typography>
            <Typography as="p">
              Focus on problems, users, requirements, and outcomes instead of
              simply generating more tasks.
            </Typography>
          </div>

          <div className="space-y-3">
            <Typography as="h3" className="text-xl font-semibold">
              Context-aware
            </Typography>
            <Typography as="p">
              Keep your project context organized so conversations lead to more
              relevant product decisions.
            </Typography>
          </div>

          <div className="space-y-3">
            <Typography as="h3" className="text-xl font-semibold">
              Developer-friendly
            </Typography>
            <Typography as="p">
              Turn product discussions into structured information that
              developers can actually work with.
            </Typography>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Differentials;
