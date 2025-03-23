import type React from "react";
import { cn } from "@/lib/utils";

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardShell({
  children,
  className,
  ...props
}: DashboardShellProps) {
  return (
    <div
      className={cn(
        "container grid items-start gap-8 px-4 py-8 md:px-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
