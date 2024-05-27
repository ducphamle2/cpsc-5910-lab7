import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import passport from "passport";
import GooglePassport from "./GooglePassport";
import EmployeeModel from "./models/EmployeeModel";
import userRouterHandler from "./routes/employees";
import { Middleware } from "./services/middleware";

export interface Models {
  employeeModel?: EmployeeModel;
}

class App {
  public express: express.Application;
  public googlePassport: GooglePassport;

  // depdendency injection for middleware & mongo models for easy testing
  private middlewareInstance: Middleware;

  constructor(private models: Models) {
    this.express = express();
    this.middleware();
    this.googlePassport = new GooglePassport();
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
    this.express.use(passport.initialize());
    this.express.use(passport.session());
  }

  public routes(): void {
    const router = express.Router();
    // setup all custom routers
    const employeeModel = userRouterHandler(this.models.employeeModel);

    router.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.header("Access-Control-Allow-Methods", "*");
      next();
    });

    router.get("/", (req, res, next) => {
      res.send("Express + TypeScript Server");
    });

    router.get(
      "/login/federated/google",
      passport.authenticate("google", {
        scope: ["profile", "email"]
      }),
      (req, res) => {
        res.send("Successful login");
      }
    );

    router.get("/logout", (req, res) => {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).send("Internal Server Error");
        }
        res.redirect("/error");
      });
    });

    this.express.use(
      "/peoplesuite/apis/employees",
      this.middlewareInstance ? this.middlewareInstance.validateAuth : (req, res, next) => next(),
      employeeModel
    );

    this.express.use("/", router);
  }
}

export { App };
