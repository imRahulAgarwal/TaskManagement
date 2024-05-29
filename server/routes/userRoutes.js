import express from "express";
import { isAdmin, isLoggedIn } from "../middlewares/authMiddleware.js";
import {
    addMember,
    addTask,
    changePassword,
    dashboard,
    deleteMember,
    deleteTask,
    listMember,
    listMembers,
    listTask,
    listTasks,
    login,
    profile,
    resetPassword,
    updateMember,
    updateTaskData,
    updateTaskMetaData,
} from "../controllers/userController.js";
import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    message: { success: false, message: "Multiple request in a short period of time." },
});

const userRouter = express.Router();

userRouter.post("/login", login);

userRouter.use(isLoggedIn);

userRouter.get("/profile", profile);

userRouter.post("/change-password", changePassword);

userRouter.get("/tasks", listTasks);

userRouter.get("/tasks/:taskId", listTask);

userRouter.patch("/tasks/:taskId", limiter, updateTaskData);

// Tasks that can be done only by Admin Role

userRouter.use(isAdmin);

userRouter.post("/reset-password", resetPassword);

userRouter.get("/members", listMembers);

userRouter.get("/members/:memberId", listMember);

userRouter.post("/members", limiter, addMember);

userRouter.put("/members/:memberId", limiter, updateMember);

userRouter.delete("/members/:memberId", limiter, deleteMember);

userRouter.post("/tasks", limiter, addTask);

userRouter.put("/tasks/:taskId", limiter, updateTaskMetaData);

userRouter.delete("/tasks/:taskId", limiter, deleteTask);

userRouter.get("/dashboard", dashboard);

export default userRouter;
