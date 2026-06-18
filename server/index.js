import express from "express";
import dns from "dns"
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./config/connectDB.js";
dns.setServers(["1.1.1.1","8.8.8.8"]);
import authRouter from "./routes/auth.route.js";
import projectRouter from "./routes/project.route.js";
import taskRouter from "./routes/task.route.js";
import worklogRouter from "./routes/worklog.route.js";
import analyticsRouter from "./routes/analytics.route.js";
import insightRouter from "./routes/insight.route.js";
import riskRouter from "./routes/risk.route.js";
import activityRouter from "./routes/activity.route.js";
import reportRouter from "./routes/report.route.js";
import dashboardRouter from "./routes/dashboard.route.js";
import Notification from "./models/notification.model.js";
import notificationRouter from "./routes/notification.route.js";
import assistantRouter from "./routes/assistant.route.js";



dotenv.config();
const app = express();
app.use(
    cors({
        origin:[process.env.CLIENT_URL,
             "https://workpulse-ai.onrender.com"
        ],
        credentials:true,
    })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRouter);
app.use("/api/project",projectRouter);
app.use("/api/task",taskRouter)
app.use("/api/worklog", worklogRouter);
app.use("/api/analytics",analyticsRouter)
app.use("/api/insights", insightRouter);
app.use("/api/risk", riskRouter);
app.use("/api/activity", activityRouter);
app.use("/api/dashboard",dashboardRouter);
app.use("/api/report",reportRouter);
app.use("/api/notification",notificationRouter);
app.use("/api/assistant", assistantRouter);

app.get("/",(req,res)=>{
    res.send("Workpulse backend running");
});
const PORT = process.env.PORT||5000;
app.listen(PORT,()=>{
    console.log(`server is listening at port ${PORT}`,connectDb());
});