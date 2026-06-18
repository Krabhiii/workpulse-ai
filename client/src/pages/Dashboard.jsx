import React from "react";
import { useSelector } from "react-redux";
import ManagerDashboard from "./ManagerDashboard";
import EmployeeDashboard from "./EmployeeDashboard";

function Dashboard() {
  const { userData } = useSelector((state) => state.user);

  if (userData?.role === "manager") {
    return <ManagerDashboard />;
  }

  return <EmployeeDashboard />;
}

export default Dashboard;