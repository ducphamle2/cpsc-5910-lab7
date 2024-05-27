import { Router } from "express";
import DepartmentModel from "../models/DepartmentModel";

// Set up multer for file upload
const departmentRouterHandler = (Departments: DepartmentModel) => {
  const router = Router();
  //Get all users
  router.get("/", async (req, res, next) => {
    try {
      const departments = await Departments.getDepartments();
      if (departments.length > 0) {
        res.status(200).json(departments);
      } else {
        res.status(404).json({ error: "Users not found" });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  //Update user information by ID
  router.post("/", async (req, res, next) => {
    try {
      const { id, cost_center, parent_id } = req.body;
      if (+cost_center < 10 ** 9 || +cost_center >= 10 ** 10) {
        return res.status(400).json({ error: "Cost center too small or too large" });
      }

      const department = await Departments.getDepartmentById(id);
      if (department.length > 0) {
        return res.status(403).json({ error: "The department already exists" });
      }

      const newDepartment = await Departments.createNewDepartment({
        departmentID: id,
        costCenter: +cost_center,
        parentDepartmentID: parent_id
      });

      res.status(200).json(newDepartment);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.get("/:id/employees", async (req, res, next) => {
    const { id } = req.params;
    try {
      // fetch api from employees.
      // const employees = await
      const employees = [];
      if (employees.length > 0) {
        res.status(200).json(employees);
      } else {
        res.status(404).json({ error: `Employees given the department ${id} not found` });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
};

export default departmentRouterHandler;
