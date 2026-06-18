import React from "react";
import { useSelector } from "react-redux";
import ManagerInsights from "./ManagerInsights";
import EmployeeInsights from "./EmployeeInsights";

function Insights() {
  const { userData } = useSelector((state) => state.user);

  if (userData?.role === "manager") {
    return <ManagerInsights />;
  }

  return <EmployeeInsights />;
}

export default Insights;