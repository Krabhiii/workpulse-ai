import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { createProjct,getProjects,getSingleProject,addTeamMember } from "../controllers/project.controller.js";

const projectRouter = express.Router();

projectRouter.post("/create",isAuth,createProjct);
projectRouter.get("/all",isAuth,getProjects);
projectRouter.get("/:id",isAuth,getSingleProject);
projectRouter.post("/add-member", isAuth, addTeamMember);

export default projectRouter;
