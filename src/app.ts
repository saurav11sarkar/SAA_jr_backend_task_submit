import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgen from "morgan";
import cookieParser from "cookie-parser";
import globalError from "./app/error/globalError";
import router from "./app/router/router";

const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgen("dev"));

// root router
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the server",
  });
});

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
    path: req.path,
  });
});

app.use(globalError);

export default app;
