import "dotenv/config.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDatabase from "./utils/connectDatabase.js";
import userRouter from "./routes/userRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
const { PORT, ORIGINS } = process.env;

const app = express();
const origin = ORIGINS.split(",");

connectDatabase();
app.use(cors({ origin }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/assets", express.static("assets"));
app.use("/api/user", userRouter);
app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server running at port ${PORT}.`));
