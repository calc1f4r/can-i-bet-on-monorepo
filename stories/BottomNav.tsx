import { Home, User } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface BottomNavProps {
  currentPath?: string;
}

const NAVIGATION_ITEMS = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "You",
    href: "/user/self",
    icon: User,
  },
] as const;

export const BottomNav: FC<BottomNavProps> = ({ currentPath = "/" }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 md:hidden z-[100] shadow-lg">
      <div className="flex justify-around items-center h-16">
        {NAVIGATION_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors duration-200
              ${
                currentPath === item.href
                  ? "text-primary bg-gray-900/50"
                  : "text-gray-400 hover:text-primary/80 hover:bg-gray-900/30"
              }`}
            aria-current={currentPath === item.href ? "page" : undefined}
          >
            <item.icon
              className={`w-6 h-6 ${
                currentPath === item.href ? "text-primary" : ""
              }`}
            />
            <span
              className={`text-xs mt-1 ${
                currentPath === item.href ? "font-medium" : ""
              }`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
