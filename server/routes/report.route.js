import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { generateWeeklyReport } from "../controllers/report.controller.js";

const reportRouter = express.Router();

reportRouter.get("/weekly", isAuth, generateWeeklyReport);

export default reportRouter;