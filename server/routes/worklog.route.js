import express from "express";
import isAuth from "../middlewares/isAuth.js";

import {
  createWorkLog,
  getMyWorkLogs,
  getTeamWorkLogs,
} from "../controllers/worklog.controller.js";

const worklogRouter = express.Router();

worklogRouter.post("/create", isAuth, createWorkLog);
worklogRouter.get("/my", isAuth, getMyWorkLogs);
worklogRouter.get("/team", isAuth, getTeamWorkLogs);

export default worklogRouter;