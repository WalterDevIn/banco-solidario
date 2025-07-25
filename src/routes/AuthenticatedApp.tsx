import { lazy, Suspense, useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";

import Header from "@/components/layout/header";
import Dashboard from "@/pages/dashboard";
import Loans from "@/pages/loans";
import Members from "@/pages/members";
import Meetings from "@/pages/meetings";
import NotFound from "@/pages/not-found";

const LoanDetails = lazy(() => import("@/pages/loan-details"));
const MemberDetails = lazy(() => import("@/pages/member-details"));
const Settings = lazy(() => import("@/pages/settings"));
const History = lazy(() => import("@/pages/history"));

export default function AuthenticatedApp() {
  const [location, setLocation] = useLocation();

  // Redirige automáticamente de "/" a "/dashboard"
  useEffect(() => {
    if (location === "/") {
      setLocation("/dashboard", { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/loans" component={Loans} />
          <Route path="/members" component={Members} />
          <Route path="/meetings" component={Meetings} />

          <Route path="/loans/:id">
            {() => (
              <Suspense fallback={<div className="p-6">Cargando préstamo...</div>}>
                <LoanDetails />
              </Suspense>
            )}
          </Route>

          <Route path="/members/:id">
            {() => (
              <Suspense fallback={<div className="p-6">Cargando miembro...</div>}>
                <MemberDetails />
              </Suspense>
            )}
          </Route>

          <Route path="/settings">
            <Suspense fallback={<div className="p-6">Cargando configuración...</div>}>
              <Settings />
            </Suspense>
          </Route>

          <Route path="/history">
            <Suspense fallback={<div className="p-6">Cargando historial...</div>}>
              <History />
            </Suspense>
          </Route>

          <Route>
            <NotFound />
          </Route>
        </Switch>
      </main>
    </div>
  );
}
