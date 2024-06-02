import { createHash } from "crypto";
import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import AuthorizationModel from "../models/AuthorizationModel";

const authorizationModelHandler = (Authorization: AuthorizationModel) => {
  const router = Router();

  router.post("/", async (req, res, next) => {
    try {
      const { client_id: clientId, client_secret: clientSecret, grant_type: grantType } = req.body;
      if (grantType !== "client_credentials") {
        res.status(400).json({ error: "Grant type is incorrect" });
      }
      try {
        const result = await Authorization.renewAccessToken(clientId, clientSecret);
        res.status(200).json({
          access_token: result.accessToken,
          token_type: Authorization.tokenType,
          expires_in: Authorization.expiresIn
        });
      } catch (error) {
        res.status(401).json({ error: error.message });
      }
      return;
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.post("/validation", async (req, res, next) => {
    try {
      const { accessToken } = req.body;
      try {
        const validateResult = await Authorization.validateAccessToken(accessToken);
        if (validateResult) {
          res.status(200).json({ message: "Authenticated", success: true });
          return;
        }
        res.status(401).json({ error: "Access Token expired", success: false });
      } catch (error) {
        res.status(400).json({ error: error.message, success: false });
      }
      return;
    } catch (error) {
      console.error("Error validating access token:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.post("/registration", async (req, res, next) => {
    try {
      const { contactEmail } = req.body;
      if (!contactEmail) {
        res.status(400).json({ error: "Contact email is empty" });
        return;
      }
      const appData = await Authorization.getContactEmail(contactEmail);
      if (appData.length > 0) {
        res.status(403).json({ error: "Contact email already registered!" });
        return;
      }
      const clientId = uuidv4({}, Buffer.from(contactEmail));
      const clientSecretGen = uuidv4({ random: [0x2] }, Buffer.from(clientId));
      const clientSecret = createHash("sha256").update(clientSecretGen).digest().toString("hex");
      const result = await Authorization.storeNewApplication({
        clientId: clientId.toString("hex"),
        clientSecret,
        contactEmail
      });
      return res.status(200).json({
        client_id: result.clientId,
        client_secret: result.clientSecret,
        access_token: result.accessToken,
        token_type: Authorization.tokenType,
        expires_in: Authorization.expiresIn
      });

      // TODO: generate new access token. Can use JWT
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
};

export default authorizationModelHandler;
