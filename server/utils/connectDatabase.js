import { connect } from "mongoose";
import User from "../models/userModel.js";
const { MONGO_URL } = process.env;
const { NAME, EMAIL, PASSWORD, NUMBER } = process.env;

const connectDatabase = async () => {
    try {
        await connect(MONGO_URL);
        console.log("Database Connected✅");
        const user = await User.find({ role: "Admin" });
        if (!user.length) await User.create({ name: NAME, email: EMAIL, password: PASSWORD, role: "Admin", number: NUMBER });
    } catch (error) {
        console.log(`Error connecting database : ${error.message}`);
    }
};

export default connectDatabase;
