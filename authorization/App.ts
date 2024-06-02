import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import AuthorizationModel from "./models/AuthorizationModel";
import authorizationRouterHandler from "./routes/authorization";

export interface Models {
  authorizationModel?: AuthorizationModel;
}

class App {
  public express: express.Application;

  constructor(private models: Models) {
    this.express = express();
    this.middleware();
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

    const authorizationModelHandler = authorizationRouterHandler(this.models.authorizationModel);
    this.express.use("/peoplesuite/apis/token", (req, res, next) => next(), authorizationModelHandler);

    this.express.use("/", router);
  }
}

export { App };
