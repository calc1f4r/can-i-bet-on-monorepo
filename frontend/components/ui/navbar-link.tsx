import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "./button"

interface NavbarLinkProps {
  href: string
  children: React.ReactNode
}

const NavbarLink = React.forwardRef<HTMLAnchorElement, NavbarLinkProps>(
  ({ href, children }, ref) => {
    const pathname = usePathname()
    const isActive = pathname === href

    return (
      <Link
        href={href}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "relative hover:underline",
          isActive && "text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
        )}
        ref={ref}
      >
        {children}
      </Link>
    )
  }
)
NavbarLink.displayName = "NavbarLink"

export { NavbarLink } 