import express from "express";

import isAuth from "../middlewares/isAuth.js";

import {
  getRiskAnalysis,
} from "../controllers/risk.controller.js";

const riskRouter = express.Router();

riskRouter.get(
  "/employees",
  isAuth,
  getRiskAnalysis
);

export default riskRouter;