import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { getActivities } from "../controllers/activity.controller.js";

const activityRouter = express.Router();

activityRouter.get("/", isAuth, getActivities);

export default activityRouter;