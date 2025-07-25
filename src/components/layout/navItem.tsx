import { Link } from "wouter";
import { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";

interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  currentPath: string;
}

export function NavItem({ href, label, icon: Icon, currentPath }: NavItemProps) {
  const [mounted, setMounted] = useState(false);
  const isActive = href === "/" ? currentPath === "/" : currentPath.startsWith(href);

  useEffect(() => {
    if (isActive) {
      const timeout = setTimeout(() => setMounted(true), 0);
      return () => clearTimeout(timeout);
    } else {
      setMounted(false);
    }
  }, [isActive]);

  return (
    <Link
      href={href}
      className={`flex items-center space-x-2 hover:text-accent transition-all duration-300 ease-out ${
        isActive ? "text-accent font-medium" : ""
      }`}
    >
      <Icon className="w-4 h-4" />
      {isActive && (
        <span
          className={`inline-block w-[80px] text-center transition-all duration-300 ease-out overflow-hidden ${
            mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
          }`}
        >
          {label}
        </span>
      )}
    </Link>
  );
}
