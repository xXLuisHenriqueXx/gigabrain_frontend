import { useRouter } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

const CTA = () => {
  const router = useRouter();

  return (
    <section className="flex min-h-[50dvh] items-center justify-center border-t px-4 py-24">
      <div className="max-w-2xl space-y-6 text-center">
        <Typography as="h2" className="text-4xl">
          Ready to build with{" "}
          <span className="text-primary">less busywork</span>?
        </Typography>

        <Typography as="p">
          Start turning your product ideas into structured software
          requirements.
        </Typography>

        <Button onClick={() => router.navigate({ to: "/project/new" })}>
          Get Started
        </Button>
      </div>
    </section>
  );
};

export default CTA;
