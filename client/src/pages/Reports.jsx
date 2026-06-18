import React from "react";
import { useSelector } from "react-redux";

import ManagerReports from "./ManagerReports";
import EmployeeReports from "./EmployeeReports";

function Reports() {
  const { userData } = useSelector((state) => state.user);

  if (userData?.role === "manager") {
    return <ManagerReports />;
  }

  return <EmployeeReports />;
}

export default Reports;