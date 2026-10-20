import { Typography } from "@/components/ui/typography";

function Methodology() {
  return (
    <section id="methodology" className="border-y bg-muted/30 px-4 py-24">
      <div className="mx-auto w-full max-w-5xl space-y-12">
        <div className="max-w-2xl space-y-4">
          <Typography as="span" className="text-sm font-medium text-primary">
            METHODOLOGY
          </Typography>

          <Typography as="h2" className="text-4xl">
            A structured approach to{" "}
            <span className="text-primary">product development</span>.
          </Typography>

          <Typography as="p">
            The assistant follows a structured product-oriented workflow,
            helping you move from an initial idea to requirements that are ready
            for implementation.
          </Typography>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-3 rounded-xl border bg-background p-6">
            <Typography as="h3" className="text-xl font-semibold">
              01. Discover
            </Typography>
            <Typography as="p">
              Understand the problem, users, goals, and context behind the
              product.
            </Typography>
          </div>

          <div className="space-y-3 rounded-xl border bg-background p-6">
            <Typography as="h3" className="text-xl font-semibold">
              02. Refine
            </Typography>
            <Typography as="p">
              Transform ideas into clear requirements, user stories, and
              actionable tasks.
            </Typography>
          </div>

          <div className="space-y-3 rounded-xl border bg-background p-6">
            <Typography as="h3" className="text-xl font-semibold">
              03. Deliver
            </Typography>
            <Typography as="p">
              Keep the product organized and maintain alignment between product
              decisions and development.
            </Typography>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Methodology;
