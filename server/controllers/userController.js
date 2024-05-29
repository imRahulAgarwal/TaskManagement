import { compare } from "bcrypt";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";
import Task from "../models/taskModel.js";
import multer from "multer";
import fs from "fs";
import { validateLoginObject, validateMemberObject, validateObjectId, validateTaskObject } from "../utils/validate.js";

const { JWT_SECRET } = process.env;
const USER_FOLDER = "assets/users";
const INVOICE_FOLDER = "assets/invoices";

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ["image/jpeg", "image/png"];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid image type. Only JPG and PNG images are allowed."));
    }
};

const invoiceFilter = (req, file, cb) => {
    const allowedFileTypes = ["application/pdf"];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only PDF files are allowed."));
    }
};

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1024 * 1024 * 3 },
    fileFilter,
});

const invoiceUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1024 * 1024 * 3 },
    fileFilter: invoiceFilter,
});

const PAGE_LIMIT = 8;

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const validationResult = await validateLoginObject({ email, password });
        if (validationResult.error) return next(new ErrorHandler(validationResult.error.message, 422));

        const user = await User.findOne({ email });

        if (!user) return next(new ErrorHandler("User does not exist.", 404));

        const checkPassword = await compare(password, user.password);
        if (!checkPassword) return next(new ErrorHandler("Invalid login credentials", 401));

        const token = await jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });
        const { name, role, email: e, number } = user._doc;
        return res.status(200).json({ success: true, message: "Successfully logged in", token, user: { name, role, email: e, number } });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

export const profile = async (req, res, next) => {
    try {
        const { password, createdAt, updatedAt, ...user } = req.user._doc;
        return res.status(200).json({ success: true, message: "User profile", user });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

export const changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        if (newPassword !== confirmPassword) return next(new ErrorHandler("Passwords do not match", 400));

        const user = req.user;
        const verifyPassword = await compare(oldPassword, user.password);
        if (!verifyPassword) return next(new ErrorHandler("Invalid password", 401));

        user.set("password", newPassword);

        const result = await user.save();
        if (!result) return next(new ErrorHandler("Unable to update password at the moment."));

        return res.status(200).json({ success: true, message: "Password updated successfully." });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

export const listTasks = async (req, res, next) => {
    try {
        const searchQuery = {};
        const user = req.user;

        const { role, name, date, completed, limit, page } = req.query;

        // Query tasks role based only when the user is Admin
        if (user.role === "Admin") {
            if (role === "0") searchQuery.isFreelancer = false;
            else if (role === "1") searchQuery.isFreelancer = true;
        } else {
            searchQuery.assignedTo = user.id;
        }

        if (name) searchQuery.name = { $regex: name, $options: "i" };

        const dateToQuery = new Date(date).getTime();
        if (dateToQuery) searchQuery.createdAt = { $gte: dateToQuery, $lte: dateToQuery + 24 * 60 * 60 * 1000 };

        if (completed === "0") searchQuery.completedPercentage = { $lt: 100, $gte: 0 };
        else if (completed === "1") searchQuery.completedPercentage = { $eq: 100 };

        const tasks = await Task.find(searchQuery, { freelancerInvoice: 0 })
            .populate("assignedTo", "_id name role")
            .skip(((page ? page : 1) - 1) * PAGE_LIMIT)
            .limit(limit ? limit : PAGE_LIMIT)
            .sort({ createdAt: 1 });
        if (!tasks.length) return next(new ErrorHandler("Tasks not assigned yet.", 404));

        const pages = Math.ceil((await Task.find(searchQuery).countDocuments()) / (limit ? limit : PAGE_LIMIT));

        return res.status(200).json({ success: true, message: "List of tasks", tasks, pages });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

export const listTask = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const validationResult = await validateObjectId(taskId);
        if (validationResult.error) return next(new ErrorHandler(validationResult.error.message, 422));

        const searchQuery = { _id: taskId };
        const user = req.user;

        if (user.role === "Employee" || user.role === "Freelancer") searchQuery.assignedTo = user.id;

        const task = await Task.findOne(searchQuery).populate("assignedTo", "_id name email number role image isActive");
        if (!task) return next(new ErrorHandler("Task ID is invalid"));

        return res.status(200).json({ success: true, message: "Task information", task });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

// Admin can also update task completed percentage or freelancer invoice
export const updateTaskData = async (req, res, next) => {
    invoiceUpload.single("invoice")(req, res, async (error) => {
        try {
            if (error) return next(new ErrorHandler(error.message, error.code ? error.code : 415));

            const { taskId } = req.params;
            const validationResult = await validateObjectId(taskId);
            if (validationResult.error) return next(new ErrorHandler(validationResult.error.message, 422));

            const user = req.user;
            const searchQuery = { _id: taskId };

            if (user.role === "Employee" || user.role === "Freelancer") searchQuery.assignedTo = user._id;

            const task = await Task.findOne(searchQuery);
            if (!task) return next(new ErrorHandler("Task ID provided is invalid.", 400));

            if (task.completedPercentage === 100 && user.role !== "Admin") {
                return next(new ErrorHandler("Cannot modify task complete status once marked completed", 400));
            }

            const updateQuery = {};
            const { completedPercentage } = req.body;
            if (completedPercentage) {
                if (completedPercentage !== "50" && completedPercentage !== "100") {
                    return next(new ErrorHandler("Task completed percentage must be either 50 or 100 percentage."));
                }
                updateQuery.completedPercentage = completedPercentage;
                if (completedPercentage === "100") updateQuery.completedDateTime = new Date().getTime();
            }

            if (user.role === "Freelancer" && req.file) {
                const invoiceFolder = `${INVOICE_FOLDER}/${task.id}`;
                if (!fs.existsSync(invoiceFolder)) fs.mkdirSync(invoiceFolder, { recursive: true });

                const invoiceBuffer = req.file.buffer;
                const newInvoicePath = `${invoiceFolder}/${Math.round(Date.now() / 1000)}_${req.file.originalname}`;

                fs.writeFileSync(newInvoicePath, invoiceBuffer);

                if (task.freelancerInvoice) fs.unlinkSync(task.freelancerInvoice);
                updateQuery.freelancerInvoice = newInvoicePath;
            }

            const result = await Task.updateOne(searchQuery, updateQuery);

            if (!result.modifiedCount && result.matchedCount) return res.status(200).json({ success: true, message: "Nothing modified." });
            if (!result.modifiedCount) return next(new ErrorHandler("Unable to update task milestone at the moment."));

            return res.status(200).json({ success: true, message: "Task milestone updated." });
        } catch (error) {
            return next(new ErrorHandler(error.message));
        }
    });
};

export const resetPassword = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const validationResult = await validateObjectId(userId);
        if (validationResult.error) return next(new ErrorHandler(validationResult.error.message, 422));

        const user = await User.findById(userId);
        if (!user) return next(new ErrorHandler("User not found"));

        user.password = user.email;
        const result = await user.save();
        if (!result) return next(new ErrorHandler("Unable to reset the password at the moment."));

        return res.status(200).json({ success: true, message: "Password resetted successfully." });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

export const listMembers = async (req, res, next) => {
    try {
        const { freelancer, name, active, limit, page } = req.query;
        const searchQuery = {};

        if (freelancer === "1") searchQuery.role = "Freelancer";
        else if (freelancer === "0") searchQuery.role = "Employee";

        if (name) searchQuery.name = { $regex: name, $options: "i" };

        if (active === "0") searchQuery.isActive = false;
        else if (active === "1") searchQuery.isActive = true;

        const users = await User.find(searchQuery, { password: 0 })
            .skip(((page ? page : 1) - 1) * PAGE_LIMIT)
            .limit(limit ? limit : PAGE_LIMIT)
            .sort({ createdAt: 1 });

        if (!users.length) return next(new ErrorHandler("Users not created yet"));

        const pages = Math.ceil((await User.find(searchQuery).countDocuments()) / (limit ? limit : PAGE_LIMIT));

        return res.status(200).json({ success: true, message: "List of users", users, pages });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

export const listMember = async (req, res, next) => {
    try {
        const { memberId } = req.params;
        const validationResult = await validateObjectId(memberId);
        if (validationResult.error) return next(new ErrorHandler(validationResult.error.message, 422));

        const user = await User.findOne({ _id: memberId, role: { $ne: "Admin" } }, { password: 0 });
        if (!user) return next(new ErrorHandler("Invalid user id"));

        return res.status(200).json({ success: true, message: "User Information", user });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

export const addMember = async (req, res, next) => {
    upload.single("image")(req, res, async (error) => {
        try {
            if (error) return next(new ErrorHandler(error.message, error.code ? error.code : 415));

            const { name, email, role, number } = req.body;
            const validationResult = await validateMemberObject({ name, email, role, number });

            if (validationResult.error) return next(new ErrorHandler(validationResult.error.message, 422));
            const user = new User({ name, email, role, number, password: email });

            if (req.file) {
                const userFolder = `${USER_FOLDER}/${user.id}`;
                if (!fs.existsSync(userFolder)) fs.mkdirSync(userFolder, { recursive: true });

                const imageBuffer = req.file.buffer;
                const imagePath = `${userFolder}/${Math.round(Date.now() / 1000)}_${req.file.originalname}`;

                fs.writeFileSync(imagePath, imageBuffer);
                user.set("image", imagePath);
            }

            const result = await user.save();
            if (!result) return next(new ErrorHandler("Unable to create an user at the moment."));

            return res.status(200).json({ success: true, message: "User created successfully." });
        } catch (error) {
            return next(new ErrorHandler(error.message, error.code));
        }
    });
};

export const updateMember = async (req, res, next) => {
    upload.single("image")(req, res, async (error) => {
        try {
            if (error) return next(new ErrorHandler(error.message, error.code ? error.code : 415));

            const { memberId } = req.params;
            const validationResult = await validateObjectId(memberId);
            if (validationResult.error) return next(new ErrorHandler(validationResult.error.message, 422));

            const { name, email, role, number, isActive } = req.body;
            const dataValidation = await validateMemberObject({ name, email, role, number, isActive }, "UPDATE");
            if (dataValidation.error) return next(new ErrorHandler(dataValidation.error.message, 422));

            const user = await User.findOne({ _id: memberId, role: { $ne: "Admin" } });

            let imagePath = user.image;

            if (req.file) {
                const userFolder = `${USER_FOLDER}/${user.id}`;
                if (!fs.existsSync(userFolder)) fs.mkdirSync(userFolder, { recursive: true });

                const imageBuffer = req.file.buffer;
                const newImagePath = `${userFolder}/${Math.round(Date.now() / 1000)}_${req.file.originalname}`;

                fs.writeFileSync(imagePath, imageBuffer);

                if (imagePath) fs.unlinkSync(imagePath);

                imagePath = newImagePath;
            }

            const result = await User.updateOne({ _id: memberId, role: { $ne: "Admin" } }, { $set: { name, email, role, number, isActive, image: imagePath } });

            if (!result.modifiedCount) return next(new ErrorHandler("Unable to update the user at the moment."));

            return res.status(200).json({ success: true, message: "User updated successfully." });
        } catch (error) {
            return next(new ErrorHandler(error.message));
        }
    });
};

export const deleteMember = async (req, res, next) => {
    try {
        const { memberId } = req.params;
        const validationResult = await validateObjectId(memberId);
        if (validationResult.error) return next(new ErrorHandler(validationResult.error.message, 422));

        const tasksOfMember = await Task.find({ assignedTo: memberId });
        if (tasksOfMember.length) return next(new ErrorHandler("Cannot remove the member."));

        const user = await User.findOne({ _id: memberId });
        if (!user) return next(new ErrorHandler("Invalid user id provided."));
        if (user && user.role === "Admin") return next(new ErrorHandler("Cannot remove Admin"));

        const result = await User.deleteOne({ _id: memberId });
        if (!result.deletedCount) return next(new ErrorHandler("Unable to delete the member at the moment."));

        return res.status(200).json({ success: true, message: "Member removed successfully." });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

export const addTask = async (req, res, next) => {
    try {
        const { name, description, deadline, assignedTo } = req.body;

        const validationResult = await validateTaskObject({ name, description, deadline });
        if (validationResult.error) return next(new ErrorHandler(validationResult.error.message, 422));

        const idValidation = await validateObjectId(assignedTo);
        if (idValidation.error) return next(new ErrorHandler(idValidation.error.message, 422));

        const member = await User.findOne({ _id: assignedTo, role: { $ne: "Admin" } });
        if (!member) return next(new ErrorHandler("Invalid member ID"));

        const role = member.role === "Freelancer" ? true : false;
        const newTask = await Task.create({ name, description, deadline, assignedTo, isFreelancer: role });

        if (!newTask) return next(new ErrorHandler("Unable to create the task at the moment."));

        return res.status(201).json({ success: true, message: "Task assigned successfully" });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

export const updateTaskMetaData = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const taskIdValidation = await validateObjectId(taskId);
        if (taskIdValidation.error) return next(new ErrorHandler(taskIdValidation.error.message, 422));

        const { name, description, deadline, assignedTo } = req.body;

        const validationResult = await validateTaskObject({ name, description, deadline });
        if (validationResult.error) return next(new ErrorHandler(validationResult.error.message, 422));

        // Validates the user assigned object id
        const idValidation = await validateObjectId(assignedTo);
        if (idValidation.error) return next(new ErrorHandler(idValidation.error.message, 422));

        const member = await User.findOne({ _id: assignedTo, role: { $ne: "Admin" } });
        if (!member) return next(new ErrorHandler("Invalid member ID"));

        const role = member.role === "Freelancer" ? true : false;
        const task = await Task.findOneAndUpdate({ _id: taskId }, { name, description, deadline, assignedTo, isFreelancer: role });

        if (!task) return next(new ErrorHandler("Unable to update the task at the moment."));

        return res.status(200).json({ success: true, message: "Task updated successfully" });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

export const deleteTask = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const idValidation = await validateObjectId(taskId);
        if (idValidation.error) return next(new ErrorHandler(idValidation.error.message, 422));

        const task = await Task.findById(taskId);

        if (!task) return next(new ErrorHandler("Invalid task id provided.", 400));
        else if (task.completedPercentage !== 0) return next(new ErrorHandler("Work on task has started.", 400));

        const result = await Task.deleteOne({ _id: taskId, completedPercentage: 0 });
        if (!result.deletedCount) return next(new ErrorHandler("Unable to delete the task at the moment."));

        return res.status(201).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};

export const dashboard = async (req, res, next) => {
    try {
        const dashboardData = { members: 0, freelancers: 0, employees: 0 };
        const members = await User.find({ role: { $ne: "Admin" } });
        if (members.length) {
            for (const member of members) {
                if (member.role === "Freelancer") dashboardData.freelancers++;
                else if (member.role === "Employee") dashboardData.employees++;
            }
            dashboardData.members = members.length;
        }

        return res.status(200).json({ success: true, message: "Dashboard Information", dashboardData });
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
};
