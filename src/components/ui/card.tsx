import * as React from "react";

import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group/card relative flex flex-col gap-4 w-full p-4 border border-border rounded-2xl text-sm",
        className,
      )}
      data-slot="card"
      {...props}
    />
  );
}

export { Card };
