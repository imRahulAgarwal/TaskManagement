import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler.js";
const { JWT_SECRET } = process.env;

export const isLoggedIn = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) return next(new ErrorHandler("Authentication header not provided", 400));

        const token = authHeader.split(" ")[1];
        if (!token || token === "null") return next(new ErrorHandler("Authentication token not provided.", 400));

        const payload = await jwt.verify(token, JWT_SECRET);
        const user = await User.findOne({ _id: payload.userId });
        if (!user) return next(new ErrorHandler("User not found, register before login.", 404));

        req.user = user;
        if (user.role !== "Admin" && user.role !== "Employee" && user.role !== "Freelancer") {
            return next(new ErrorHandler("Unauthorized user access", 401));
        }
        return next();
    } catch (error) {
        return next(new ErrorHandler(error.message, error.statusCode));
    }
};

export const isAdmin = async (req, res, next) => {
    if (req.user.role !== "Admin") return next(new ErrorHandler("Unauthorized", 401));
    else return next();
};
