import { Brain } from "lucide-react";

import { Typography } from "../ui/typography";

export function Logo() {
  return (
    <div className="flex flex-row items-center gap-4">
      <div className="flex shrink-0 items-center justify-center size-12 bg-violet-500 rounded-2xl">
        <Brain className="size-6" />
      </div>

      <div className="-space-y-1">
        <Typography as="h5">Gigabrain</Typography>
        <Typography as="small">Your PO Assistant</Typography>
      </div>
    </div>
  );
}
