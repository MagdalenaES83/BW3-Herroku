import express from "express";

import cors from "cors";

import listEndpoints from "express-list-endpoints";

// import authorsRouter from "./authors/index.js";

// import blogsRouter from "./blogs/index.js";

// import { errorHandler } from "./errorHandlers.js";
// import dotenv from "dotenv";
// dotenv.config();
import path, { dirname } from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";

import profilesRouter from "./services/profiles/index.js";
import experiencesRouter from "./services/experiences/index.js";

import postRouter from "./services/Posts/ROUTES/post.js"




const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const publicDirectory = path.join(__dirname, "../public");

const server = express();
 const { PORT } = process.env ;
//const PORT = 3002;

const whiteList = ["http://localhost:3002"];
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.some((allowedUrl) => allowedUrl === origin)) {
      callback(null, true);
    } else {
      const error = new Error("Not allowed by cors!");
      error.status = 403;
      callback(error);
    }
  },
};
const loggerMiddleware = (req, res, next) => {
  console.log(`Request method ${req.method} +++++ Request URL ${req.url}`)
  next()  // don't forget the NEXT() not to get stuck in sending request :)
}

server.use(cors());

server.use(express.json());

server.use(express.static(publicDirectory));

server.use(loggerMiddleware)
server.use("/profiles", profilesRouter)
server.use("/experiences", experiencesRouter)


//routers
server.use("/posts", postRouter)

// server.use("/authors", authorsRouter);

// server.use("/blogs", blogsRouter);

// server.use(errorHandler);

console.log(listEndpoints(server));

mongoose.connect(process.env.MONGO_CONNECTION);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!");
  server.listen(PORT, () =>
    console.log("✅ Server is running on port : ", PORT)
  );
});

mongoose.connection.on("error", (error) =>
  console.log(`❌ Server is not running due to : ${error}`)
);
