import { Typography } from "@/components/ui/typography";

function Methodology() {
  return (
    <section id="methodology" className="border-y bg-muted/30 px-4 py-24">
      <div className="mx-auto w-full max-w-5xl space-y-12">
        <div className="max-w-2xl space-y-4">
          <Typography as="span" className="text-sm font-medium text-primary">
            HOW IT WORKS
          </Typography>

          <Typography as="h2" className="text-4xl">
            A conversation, a council and{" "}
            <span className="text-primary">your final say</span>.
          </Typography>

          <Typography as="p">
            Every requirement goes through the same path, from your first
            message to the moment you approve it.
          </Typography>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-3 rounded-xl border bg-background p-6">
            <Typography as="h3" className="text-xl font-semibold">
              01. Talk
            </Typography>
            <Typography as="p">
              Describe a need in your own words. The Digital Twin, your
              counterpart in the system, asks questions until the request is
              clear.
            </Typography>
          </div>

          <div className="space-y-3 rounded-xl border bg-background p-6">
            <Typography as="h3" className="text-xl font-semibold">
              02. Deliberate
            </Typography>
            <Typography as="p">
              The Twin consults a Leader, who routes each question to the
              expert of that topic. The Critic scores the proposal and sends
              back what does not pass.
            </Typography>
          </div>

          <div className="space-y-3 rounded-xl border bg-background p-6">
            <Typography as="h3" className="text-xl font-semibold">
              03. Approve
            </Typography>
            <Typography as="p">
              Nothing is saved without your explicit approval. Approved
              requirements keep their versions, links and origin.
            </Typography>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Methodology;
