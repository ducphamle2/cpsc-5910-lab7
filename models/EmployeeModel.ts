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
        employeeID: Number,
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

  public async getEmployeeById(id: number) {
    return (await this.model.query("employeeID").eq(id).exec()).map((data) => data.toJSON());
  }

  public async createNewEmployee(data: {
    employeeID: number;
    firstName: string;
    lastName: string;
    startDate: number;
    country: number;
    departmentID: string;
    title: string;
    managerID?: string;
    managerName?: string;
  }) {
    const result = await this.model.create(data);
    return result.toJSON();
  }
}
