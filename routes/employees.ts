import { Router } from "express";
import multer from "multer";
import EmployeeModel from "../models/EmployeeModel";

// Set up multer for file upload
const upload = multer({ dest: "/tmp/uploads/" });

const employeeRouterHandler = (Users: EmployeeModel) => {
  const router = Router();
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

  router.post("/:id/photo", upload.single("employee-photo"), async (req, res, next) => {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    try {
      const ifBucketExist = await Users.checkIfBucketExists();
      if (!ifBucketExist) {
        const err = await Users.createBucket();
        if (err) {
          return res.status(500).json({ error: err });
        }
      }
      const err = await Users.uploadEmployeeImage(id, req.file);
      if (!err) {
        res.status(200).json();
      } else {
        res.status(400).json({ error: err });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.get("/:id/photo/:name", async (req, res, next) => {
    const { id, name } = req.params;
    try {
      const imageStream = await Users.downloadEmployeeImage(id, name);
      res.setHeader("Content-Disposition", `attachment; filename=${id}-${name}`);
      imageStream.pipe(res);
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

export default employeeRouterHandler;
