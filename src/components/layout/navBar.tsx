import { Calendar, DollarSign, Home, Users } from "lucide-react";
import { useLocation } from "wouter";
import { NavItem } from "./navItem";

export function NavBar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/meetings", label: "Reuniones", icon: Calendar },
    { href: "/loans", label: "Préstamos", icon: DollarSign },
    { href: "/members", label: "Integrantes", icon: Users },
  ];

  return (
    <nav className="hidden md:flex space-x-8">
      {navItems.map((item) => (
        <NavItem
          key={item.href}
          href={item.href}
          label={item.label}
          icon={item.icon}
          currentPath={location}
        />
      ))}
    </nav>
  );
}
