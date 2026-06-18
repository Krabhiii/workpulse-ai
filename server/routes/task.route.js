import express from "express";
import isAuth from "../middlewares/isAuth.js"
import { createTask,getTasks,getProjectTasks,getMyTasks,updateTaskStatus } from "../controllers/task.controller.js";


const taskRouter = express.Router();
taskRouter.post("/create",isAuth,createTask);
taskRouter.get("/all",isAuth,getTasks);
taskRouter.get("/my",isAuth,getMyTasks);
taskRouter.get("/projet/:projectId",isAuth,getProjectTasks);
taskRouter.patch("/status/:id",isAuth,updateTaskStatus);
export default taskRouter;