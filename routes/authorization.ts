import { createHash } from "crypto";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { v5 as uuidv5 } from "uuid";
import AuthorizationModel from "../models/AuthorizationModel";

const authorizationModelHandler = (Authorization: AuthorizationModel) => {
  const router = Router();

  router.post("/", async (req, res, next) => {
    try {
      const { clientId, clientSecret } = req.body;
      const app = await Authorization.getAuthorizationData(clientId, clientSecret);
      if (app.length > 0) {
        const expiresIn = "10h";
        const accessToken = jwt.sign(clientId, clientSecret, { expiresIn });
        res.status(200).json({ access_token: accessToken, token_type: "Bearer", expire_in: expiresIn });
        return;
      }
      res.status(404).json({ error: "Client id and client secret do not match. Cannot grant authorization!" });
      return;
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.post("/validation", async (req, res, next) => {
    try {
      const { accessToken } = req.body;
      const app = await Authorization.validateAccessToken(accessToken);
      if (app.length > 0) {
        res.status(200).json({ message: "Authorized", success: true });
        return;
      }
      res.status(403).json({ error: "Access token not found. Unauthorized", success: false });
      return;
    } catch (error) {
      console.error("Error validating access token:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.post("/registration", async (req, res, next) => {
    try {
      const { contactEmail } = req.body;
      const appData = await Authorization.getContactEmail(contactEmail);
      if (appData.length > 0) {
        res.status(403).json({ error: "Contact email already registered!" });
        return;
      }
      const clientId = uuidv5(contactEmail, contactEmail);
      const clientSecretGen = uuidv5(clientId, clientId);
      const clientSecret = createHash("sha256").update(clientSecretGen).digest().toString("hex");
      const result = await Authorization.storeNewApplication({ clientId, clientSecret, contactEmail });
      return res.status(200).json(result);

      // TODO: generate new access token. Can use JWT
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
};

export default authorizationModelHandler;
