import { Schema } from "dynamoose/dist/Schema";
import BaseModel from "./BaseModel";

export default class DepartmentModel extends BaseModel {
  public constructor() {
    super("departments");
    this.createSchema();
    this.createModel();
  }

  private createSchema = (): void => {
    this.schema = new Schema(
      {
        departmentID: String,
        costCenter: Number,
        parentDepartmentID: String
      },
      { saveUnknown: ["parentDepartmentID"], timestamps: true }
    );
  };

  public async getDepartments() {
    const scanResult = await this.model.scan().all().exec();
    return scanResult.map((result) => result.toJSON());
  }

  public async getDepartmentById(id: string) {
    return (await this.model.query("departmentID").eq(id).exec()).map((data) => data.toJSON());
  }

  public async createNewDepartment(data: { departmentID: string; costCenter: number; parentDepartmentID?: string }) {
    const result = await this.model.create(data);
    return result.toJSON();
  }
}
