import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
    getNotifications,
    markNotificationRead,
    markAllNotificationRead,
    
} from "../controllers/notification.controller.js";

const notificationRouter = express.Router();
notificationRouter.get("/",isAuth,getNotifications);
notificationRouter.patch("/read/:id",isAuth,markNotificationRead);
notificationRouter.patch("/read-all",isAuth,markAllNotificationRead);
export default notificationRouter;