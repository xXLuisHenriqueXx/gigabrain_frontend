import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className={cn("group/item-group flex flex-col gap-4 w-full", className)}
      {...props}
    />
  );
}

const itemVariants = cva(
  "group/item flex items-center gap-4 w-full p-2 rounded-3xl border text-sm transition-colors duration-200 outline-none focus-visible:border-ring",
  {
    variants: {
      variant: {
        default: "border-transparent",
        outline: "border-border",
        muted: "border-transparent bg-muted/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Item({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemVariants>) {
  return (
    <div
      data-slot="item"
      data-variant={variant}
      className={cn(itemVariants({ variant, className }))}
      {...props}
    />
  );
}

function ItemIcon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-media"
      className={cn(
        "flex shrink-0 items-center justify-center size-12 rounded-2xl bg-muted-foreground/25 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn("flex flex-1 flex-col gap-0.5", className)}
      {...props}
    />
  );
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn(
        "flex items-center gap-2 w-fit text-sm line-clamp-1 leading-snug font-medium",
        className,
      )}
      {...props}
    />
  );
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "text-sm line-clamp-2 text-left leading-normal font-normal text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex flex-row items-center gap-2", className)}
      {...props}
    />
  );
}

export {
  Item,
  ItemIcon,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemTitle,
  ItemDescription,
};
