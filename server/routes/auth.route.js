import express from "express";
import {register,login,googleAuth,currentUser,logout,} from "../controllers/auth.controller.js"

import isAuth from "../middlewares/isAuth.js"


const authRouter = express.Router();
authRouter.post("/register",register);
authRouter.post("/login",login);
authRouter.post("/google",googleAuth);

authRouter.get("/current-user",isAuth,currentUser);
authRouter.get("/logout",logout);

export default authRouter;