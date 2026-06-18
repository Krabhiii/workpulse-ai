import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { askAssistant } from "../controllers/assistant.controller.js";

const assistantRouter = express.Router();

assistantRouter.post("/ask", isAuth, askAssistant);

export default assistantRouter;