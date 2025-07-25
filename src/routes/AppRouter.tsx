import { Router, Route } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Login from "@/pages/login";
import AuthenticatedApp from "./AuthenticatedApp";

export default function AppRouter() {
  const isAuthenticated = useAuth(state => state.isAuthenticated);

  return (
    <Router>
      {isAuthenticated ? (
      
        <AuthenticatedApp />
      
      ) : (
      
        <>
          <Route path="/login" component={Login} />

          {/* fallback para cualquier ruta */}
          <Route>
            {() => <Login />}
          </Route> 
        </>
      
      )}
    </Router>
  );
}