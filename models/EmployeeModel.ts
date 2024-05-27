import { Schema } from "dynamoose/dist/Schema";
import BaseModel from "./BaseModel";

export default class EmployeeModel extends BaseModel {
  private static instance: EmployeeModel;

  public constructor() {
    super("employees");
    this.createSchema();
    this.createModel();
  }

  public createSchema = (): void => {
    this.schema = new Schema(
      {
        employeeID: String,
        firstName: String,
        lastName: String,
        startDate: Number,
        country: Number,
        departmentID: String,
        title: String,
        managerID: String,
        managerName: String
      },
      { saveUnknown: ["managerID", "managerName"], timestamps: true }
    );
  };

  public static getInstance(): EmployeeModel {
    if (!EmployeeModel.instance) {
      EmployeeModel.instance = new EmployeeModel();
    }
    return EmployeeModel.instance;
  }

  public async createTable() {
    await this.model.table().initialize();
  }

  public async getEmployees() {
    const scanResult = await this.model.scan().all().exec();
    return scanResult.map((result) => result.toJSON());
  }
}
