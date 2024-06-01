import { Router } from "express";
import AuthorizationModel from "../models/AuthorizationModel";

const authorizationModelHandler = (Authorization: AuthorizationModel) => {
  const router = Router();

  //Get all users
  router.post("/", async (req, res, next) => {
    try {
      const { clientId, clientSecret } = req.body;
      const users = await Authorization.getAuthorizationData(clientId, clientSecret);
      if (users.length > 0) {
        // TODO: generate new access token. Can use JWT
        res.status(200).json(users);
        return;
      }
      res.status(404).json({ error: "Client id and client secret do not match. Cannot grant authorization!" });
      return;
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.post("/register", async (req, res, next) => {
    try {
      const { contactEmail } = req.body;
      const appData = await Authorization.getContactEmail(contactEmail);
      if (appData.length > 0) {
        res.status(200).json(appData);
        return;
      }
      res.status(404).json({ error: "Client id and client secret do not match. Cannot grant authorization!" });
      return;

      // TODO: generate new access token. Can use JWT
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
};

export default authorizationModelHandler;
