import React from "react";
import { useSelector } from "react-redux";
import ManagerAnalytics from "./ManagerAnalytics";
import EmployeeAnalytics from "./EmployeeAnalytics";

function Analytics() {
  const { userData } = useSelector((state) => state.user);

  return userData?.role === "manager" ? (
    <ManagerAnalytics />
  ) : (
    <EmployeeAnalytics />
  );
}

export default Analytics;