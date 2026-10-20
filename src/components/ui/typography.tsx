import { cn } from "cn";
import type { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "small" | "span";
  className?: string;
}

const typographyVariants = {
  h1: "scroll-m-20 text-4xl font-bold tracking-tight",
  h2: "scroll-m-20 text-3xl font-bold tracking-tight",
  h3: "scroll-m-20 text-2xl font-bold tracking-tight",
  h4: "scroll-m-20 text-xl font-bold tracking-tight",
  h5: "scroll-m-20 text-lg font-bold tracking-tight",
  h6: "scroll-m-20 text-base font-bold tracking-tight",
  p: "text-sm text-muted-foreground",
  small: "text-xs text-muted-foreground",
  span: "text-sm text-muted-foreground",
};

export function Typography({ as = "p", className, children }: Props) {
  const Component = as;

  return (
    <Component className={cn(typographyVariants[as], className)}>
      {children}
    </Component>
  );
}
