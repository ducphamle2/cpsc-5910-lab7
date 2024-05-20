import Mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import IEmployeeModel from "../interfaces/IEmployeeModel";
import BaseModel from "./BaseModel";

export default class EmployeeModel extends BaseModel {
  public model: any;
  private static instance: EmployeeModel;

  public constructor(connection: Mongoose.Connection) {
    super(connection, "employees");
    this.createSchema();
    this.createModel();
  }

  public createSchema = (): void => {
    this.schema = new Schema(
      {
        authID: String,
        userID: String,
        firstName: String,
        lastName: String,
        email: String,
        phoneNumber: String,
        profilePic: String,
      },
      {
        collection: this.collectionName,
      }
    );
  };

  public createModel = () => {
    if (!this.connection.models[this.collectionName]) {
      this.model = this.connection.model<IEmployeeModel>(
        this.collectionName,
        this.schema
      );
    } else {
      this.model = this.connection.models[this.collectionName];
    }
  };

  public static getInstance(connection: Mongoose.Connection): EmployeeModel {
    if (!EmployeeModel.instance) {
      EmployeeModel.instance = new EmployeeModel(connection);
    }
    return EmployeeModel.instance;
  }

  public async addEmployee(
    authID: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    profilePic: string
  ) {
    const userID = uuidv4();

    const newEmployee = new this.model({
      authID: authID,
      userID: userID,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      profilePic: profilePic,
    });

    await newEmployee.save();
    return userID;
  }

  public async updateEmployee(
    userID: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    profilePic: string
  ) {
    return this.model.findOneAndUpdate(
      { userID, firstName, lastName, email, phoneNumber, profilePic },
      { new: true }
    );
  }

  public async getEmployeeByID(userID: string) {
    return this.model.findOne({ userID: userID });
  }

  public async getEmployeeByAuth(authID: string) {
    return this.model.findOne({ authID: authID });
  }

  public async getEmployees() {
    return this.model.find();
  }
}