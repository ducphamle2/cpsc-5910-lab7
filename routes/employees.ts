import { Router } from "express";
import EmployeeModel from "../models/EmployeeModel";

const userRouterHandler = (Users: EmployeeModel) => {
  const router = Router();

  // //Get one user by ID
  // router.get("/:id", async (req, res, next) => {
  //   try {
  //     const id = req.session["uuid"] ? req.session["uuid"] : req.params.id;
  //     const user = await Users.getEmployeeByID(id);
  //     if (user) {
  //       res.json(user);
  //     } else {
  //       res.status(404).json({ error: "User not found" });
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //     res.status(500).json({ error: "Internal server error" });
  //   }
  // });

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

  router.get("/:id/profile", async (req, res, next) => {
    const { id } = req.params;
    try {
      const users = await Users.getEmployeeById(+id);
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
  router.post("/:id/profile", async (req, res, next) => {
    try {
      const { id } = req.params;
      if (+id < 1000000 || +id > 9999999) {
        return res.status(400).json({ error: "Employee ID too small or too large" });
      }
      const { firstName, lastName, startDate, country, departmentID, title, managerID, managerName } = req.body;

      const employee = await Users.getEmployeeById(+id);
      if (employee.length > 0) {
        return res.status(403).json({ error: "The employee's profile already exists" });
      }

      const newEmployee = await Users.createNewEmployee({
        employeeID: +id,
        firstName,
        lastName,
        startDate,
        country,
        departmentID,
        title,
        managerID,
        managerName
      });

      res.status(200).json(newEmployee);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  return router;
};

export default userRouterHandler;
