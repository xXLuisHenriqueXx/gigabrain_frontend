import { useRouter } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { HexagonPattern } from "@/components/ui/hexagon-pattern";

import { scrollTo } from "@/utils/scrollTo";

function Hero() {
  const router = useRouter();

  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center gap-8">
      <HexagonPattern
        className="animate-pulse mask-[radial-gradient(480px_circle_at_center,white,transparent)]"
        gap={16}
      />

      <div className="max-w-2xl space-y-2 px-4 text-center">
        <Typography as="h1" className="text-5xl">
          Build better software, without the{" "}
          <span className="text-primary">busywork</span>.
        </Typography>

        <Typography as="p">
          Your personal Product Owner assistant to plan, refine, and manage your
          software projects with ease.
        </Typography>
      </div>

      <div className="flex w-full max-w-2xl flex-row gap-2 px-4">
        <Button
          className="w-full flex-1"
          onClick={() => router.navigate({ to: "/projects" })}
        >
          Get Started
        </Button>

        <Button
          className="w-full flex-1"
          variant="outline"
          onClick={() => scrollTo("methodology")}
        >
          Our Methodology
        </Button>
      </div>
    </section>
  );
}

export default Hero;
