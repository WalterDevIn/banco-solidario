import { Link } from "wouter";
import { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";
import "./nav-item.css";

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
    <Link href={href} className={`nav-item ${isActive ? "active" : ""}`}> 
      <Icon className="icon" />
      {isActive && (
        <span className={`nav-label ${mounted ? "show" : ""}`}>{label}</span>
      )}
    </Link>
  );
}
