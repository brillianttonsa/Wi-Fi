import { useNavigate, useOutletContext } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { DashboardOutletContext } from "../types";
import { Home } from "./Home";

export function DashboardHomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { connection, pendingToken, activateWifi } = useOutletContext<DashboardOutletContext>();

  return (
    <Home
      customerName={user?.fullName ?? ""}
      connection={connection}
      pendingToken={pendingToken}
      onActivate={activateWifi}
      onViewPackages={() => navigate("/packages")}
    />
  );
}
