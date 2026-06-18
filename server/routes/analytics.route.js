import express from "express";
import isAuth from "../middlewares/isAuth.js";

import { getManagerDashboard,getEmployeePerformance,getProjectHealth } from "../controllers/analytics.controller.js";

const analyticsRouter = express.Router();
analyticsRouter.get("/dashboard",isAuth,getManagerDashboard);
analyticsRouter.get("/employees",isAuth,getEmployeePerformance);
analyticsRouter.get("/projects",isAuth,getProjectHealth);
export default analyticsRouter;