import Link from "next/link";
import { cn } from "~/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/traces"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Traces
      </Link>
      <Link
        href="/metrics"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Metrics
      </Link>
      <Link
        href="/logs"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Logs
      </Link>
    </nav>
  );
}
