"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

interface NavbarLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavbarLink = React.forwardRef<HTMLAnchorElement, NavbarLinkProps>(
  ({ href, children }, ref) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
      <Link
        href={href}
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center text-md font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "relative px-4 py-2",
          // Desktop styles (hidden on mobile)
          "md:after:absolute md:after:bottom-0 md:after:left-2 md:after:right-2 md:after:h-[2px] md:after:bg-primary",
          "md:after:transition-transform md:after:duration-150",
          // Mobile styles
          "md:text-foreground",
          isActive
            ? [
                // Desktop active
                "md:text-primary md:after:scale-x-100",
                // Mobile active
                "text-primary underline md:no-underline",
              ]
            : [
                // Desktop hover/inactive
                "md:after:scale-x-0 md:hover:text-primary md:hover:after:scale-x-100",
                // Mobile hover/inactive
                "text-foreground hover:text-primary hover:underline md:hover:no-underline",
              ]
        )}
      >
        {children}
      </Link>
    );
  }
);
NavbarLink.displayName = "NavbarLink";

export { NavbarLink };
