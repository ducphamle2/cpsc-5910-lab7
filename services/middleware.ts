// Configure Auth Validation
import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { config } from "../config";

export class Middleware {
  async validateAuth(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ) {
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ message: "Unauthorized" });
    const [tokenType, accessToken] = authorization.split(" ");
    if (tokenType !== "Bearer") return res.status(400).json({ message: "Not bearer token" });
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const endpoint = `${config.AUTHORIZATION_SERVICE_URL}/peoplesuite/apis/token/validation`;
    const validationResult = await fetch(
      endpoint,
      {
        method: "POST",
        body: JSON.stringify({ accessToken }),
        headers: myHeaders
      }
    ).then((data) => data.json());
    if (validationResult.success) {
      next();
      return;
    }
    return res.status(401).json(validationResult);
  }
}
