import { useRouter } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

const CTA = () => {
  const router = useRouter();

  return (
    <section className="flex min-h-[50dvh] items-center justify-center border-t px-4 py-24">
      <div className="max-w-2xl space-y-6 text-center">
        <Typography as="h2" className="text-4xl">
          Ready to define your{" "}
          <span className="text-primary">first project</span>?
        </Typography>

        <Typography as="p">
          Create a project and start turning your ideas into structured
          software requirements.
        </Typography>

        <Button onClick={() => router.navigate({ to: "/projects" })}>
          Create a project
        </Button>
      </div>
    </section>
  );
};

export default CTA;
