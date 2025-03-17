import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import express, { Express } from "express";
import postsRoute from "./routes/posts_route";
import commentsRoute from "./routes/comments_route";
import authRoutes from "./routes/auth_route";
import fileRoute from "./routes/file_route";
import aiRoute from "./routes/ai_route";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import cors from "cors";
import cookieParser from "cookie-parser";

const corsOptions = {
  origin: (origin: any, callback: (arg0: null, arg1: boolean) => void) => {
    callback(null, true); // Allow all origins
  }, // Allow requests from your frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Allow credentials (cookies, authorization headers)
};

const app = express();
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/public", express.static("public"));
app.use(express.static("front"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/posts", postsRoute);
app.use("/comments", commentsRoute);
app.use("/auth", authRoutes);
app.use("/files", fileRoute);
app.use("/ai", aiRoute);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Web Dev 2025 REST API",
      version: "1.0.0",
      description: "REST server including authentication using JWT",
    },
    servers: [{ url: `http://localhost:${process.env.PORT}` }, { url: `https://node121.cs.colman.ac.il` }],
  },
  apis: ["./routes/*.ts"],
};
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

const initApp = () => {
  return new Promise<Express>((resolve, reject) => {
    if (!process.env.DB_CONNECT) {
      reject("DB_CONNECT is not defined in .env file");
    } else {
      mongoose
        .connect(process.env.DB_CONNECT)
        .then(() => {
          resolve(app);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};

export default initApp;
