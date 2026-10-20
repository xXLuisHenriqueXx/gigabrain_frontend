import * as React from "react";

import { cn } from "cn";

function Marker({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group/marker relative flex items-center gap-2 w-fit text-sm text-left text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function MarkerIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:pointer-events-none",
        className,
      )}
      data-slot="marker-icon"
      aria-hidden
      {...props}
    />
  );
}

function MarkerContent({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("min-w-0 wrap-break-word", className)}
      data-slot="marker-content"
      {...props}
    />
  );
}

export { Marker, MarkerIcon, MarkerContent };
