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
        resave: true,
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
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      res.header("Access-Control-Allow-Methods", "*");
      next();
    });

    router.get("/", (req, res, next) => {
      res.send("Express + TypeScript Server");
    });

    router.get(
      "/login/federated/google",
      passport.authenticate("google", {
        scope: ["profile", "email"],
      }),
      (req, res) => {
        res.send("Successful login");
      }
    );

    router.get(
      "/login/federated/google/callback",
      (req, res, next) => {
        req.session.save();
        next();
      },
      passport.authenticate("google", {
        failureRedirect: "/error",
      }),
      async (req, res) => {
        const googleProfile: any = JSON.parse(JSON.stringify(req.user));
        let doesUserExist: any =
          await this.models.employeeModel.getEmployeeByAuth(googleProfile.id);

        if (!doesUserExist) {
          let newUser: any = await this.models.employeeModel.addEmployee(
            googleProfile.id,
            googleProfile.name.givenName,
            googleProfile.name.familyName,
            googleProfile.emails[0].value,
            "123456789",
            googleProfile.photos[0].value
          );
          req.session["uuid"] = newUser;
        } else {
          req.session["uuid"] = doesUserExist.userID;
        }
        req.session.save();

        // TODO: Have to change this to a relative link, otherwise the session information is lost
        // Solution is to inject frontend build files into the backend and serve them
        res.redirect("/dashboard");
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
      this.middlewareInstance
        ? this.middlewareInstance.validateAuth
        : (req, res, next) => next(),
      employeeModel
    );

    this.express.use("/", router);
  }
}

export { App };
