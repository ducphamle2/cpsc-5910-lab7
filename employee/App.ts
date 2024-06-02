import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import EmployeeModel from "./models/EmployeeModel";
import userRouterHandler from "./routes/employees";
import { Middleware } from "./services/middleware";

export interface Models {
  employeeModel?: EmployeeModel;
}

class App {
  public express: express.Application;

  // depdendency injection for middleware & mongo models for easy testing
  private middlewareInstance: Middleware;

  constructor(private models: Models) {
    this.express = express();
    this.middleware();
  }

  withMiddleware(middleware: Middleware) {
    this.middlewareInstance = middleware;
    return this;
  }

  private middleware(): void {
    this.express.use(cors());
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(
      session({
        secret: "toxic flamingo",
        saveUninitialized: true,
        resave: true
      })
    );
  }

  public routes(): void {
    const router = express.Router();

    router.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.header("Access-Control-Allow-Methods", "*");
      next();
    });

    router.get("/", (req, res, next) => {
      res.send("Welcome!");
    });

    if (this.models.employeeModel) {
      const employeeModelHandler = userRouterHandler(this.models.employeeModel);
      this.express.use(
        "/peoplesuite/apis/employees",
        this.middlewareInstance ? this.middlewareInstance.validateAuth : (req, res, next) => next(),
        employeeModelHandler
      );
    }

    this.express.use("/", router);
  }
}

export { App };
