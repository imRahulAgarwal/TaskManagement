import { Schema, model, Types } from "mongoose";

const taskSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        deadline: {
            type: Date,
            required: true,
        },
        assignedTo: {
            type: Types.ObjectId,
            required: true,
            ref: "users",
        },
        isFreelancer: {
            type: Boolean,
            required: true,
        },
        freelancerInvoice: {
            type: String,
        },
        completedPercentage: {
            type: Number,
            required: true,
            default: 0,
        },
        completedDateTime: {
            type: Date,
            default: null,
        },
    },
    { versionKey: false, timestamps: { createdAt: true, updatedAt: false } }
);

const Task = model("tasks", taskSchema);

export default Task;
