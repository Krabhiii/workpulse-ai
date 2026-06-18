import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { getDashboardOverview } from "../controllers/dashboard.controller.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/overview", isAuth, getDashboardOverview);

export default dashboardRouter;