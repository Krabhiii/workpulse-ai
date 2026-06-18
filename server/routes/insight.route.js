import express from "express";

import isAuth from "../middlewares/isAuth.js";

import {
  generateManagerInsights,
} from "../controllers/insight.controller.js";

const insightRouter = express.Router();

insightRouter.get(
  "/manager",
  isAuth,
  generateManagerInsights
);

export default insightRouter;