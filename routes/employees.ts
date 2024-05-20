import { Router } from "express";
import EmployeeModel from "../models/EmployeeModel";

const userRouterHandler = (Users: EmployeeModel) => {
  const router = Router();

  //Get one user by ID
  router.get("/:id", async (req, res, next) => {
    try {
      const id = req.session["uuid"] ? req.session["uuid"] : req.params.id;
      const user = await Users.getEmployeeByID(id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  //Get all users
  router.get("/", async (req, res, next) => {
    try {
      const users = await Users.getEmployees();
      if (users.length > 0) {
        res.status(200).json(users);
      } else {
        res.status(404).json({ error: "Users not found" });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  //Update user information by ID
  router.put("/:id", async (req, res, next) => {
    try {
      const id = req.session["uuid"] ? req.session["uuid"] : req.params.id;
      const { firstName, lastName, email, phoneNumber, profilePic } = req.body;

      const updatedUser = await Users.updateEmployee(
        id,
        firstName,
        lastName,
        email,
        phoneNumber,
        profilePic
      );

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  return router;
};

export default userRouterHandler;
