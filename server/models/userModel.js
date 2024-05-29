import { hash } from "bcrypt";
import { Schema, model } from "mongoose";
import ErrorHandler from "../utils/ErrorHandler.js";
const { SERVER_DOMAIN } = process.env;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        number: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            required: true,
            enum: ["Admin", "Employee", "Freelancer"],
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true,
        },
        image: {
            type: String,
            default: null,
        },
    },
    { versionKey: false, timestamps: { createdAt: true, updatedAt: false } }
);

userSchema.pre("save", async function (next) {
    try {
        this.password = await hash(this.password, 10);
        return next();
    } catch (error) {
        return next(new ErrorHandler(error.message));
    }
});

userSchema.post("find", function (documents, next) {
    if (documents.length) {
        for (const document of documents) {
            document.image = `${SERVER_DOMAIN}${document.image}`;
        }
    }
    return next();
});

const User = model("users", userSchema);

export default User;
