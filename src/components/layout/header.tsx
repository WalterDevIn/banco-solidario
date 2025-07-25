import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  University,
  Home,
  Calendar,
  DollarSign,
  Users,
  Settings,
  LogOut,
  CalendarClock,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { NavBar } from "./navBar";
import AdvanceDateModal from "@/components/modals/advance-date-modal";
import AccessLogModal from "@/components/modals/access-log-modal"; // ajustá el path si es diferente
import "./header.css";

export default function Header() {
  const [location] = useLocation();
  const { logout } = useAuth();

  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [logsModalOpen, setLogsModalOpen] = useState(false);
  const [systemDate, setSystemDate] = useState(new Date());

  const navItems = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/meetings", label: "Reuniones", icon: Calendar },
    { href: "/loans", label: "Préstamos", icon: DollarSign },
    { href: "/members", label: "Integrantes", icon: Users },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-content">
          {/* Logo y título */}
          <div className="header-logo">
            <University className="icon-large" />
            <div>
              <h1 className="header-title">Banco Solidario</h1>
              <p className="header-subtitle">
                Sistema de Gestión de Préstamos
              </p>
            </div>
          </div>

          {/* Navegación central */}
          <NavBar />

          {/* Botones del lado derecho */}
          <div className="header-actions">
            {/* Botón para modificar fecha */}
            <Button
              variant="ghost"
              size="sm"
              className="text-white border border-white hover:bg-primary/80"
              onClick={() => setDateModalOpen(true)}
            >
              <CalendarClock className="w-4 h-4" />
            </Button>

            {/* Botón para ver logs */}
            <Button
              variant="ghost"
              size="sm"
              className="text-white border border-white hover:bg-primary/80"
              onClick={() => setLogsModalOpen(true)}
            >
              <ClipboardList className="w-4 h-4" />
            </Button>

            <Link href="/settings">
              <Button variant="ghost" size="icon" className="hover:text-accent">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="hover:text-accent"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de avance de fecha */}
      <AdvanceDateModal
        open={dateModalOpen}
        onOpenChange={setDateModalOpen}
        currentDate={systemDate}
        onDateAdvance={(newDate) => setSystemDate(newDate)}
      />

      {/* Modal de logs */}
      <AccessLogModal
        open={logsModalOpen}
        onOpenChange={setLogsModalOpen}
      />
    </header>
  );
}
