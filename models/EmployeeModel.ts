import {
  CreateBucketCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client
} from "@aws-sdk/client-s3";
import { Schema } from "dynamoose/dist/Schema";
import fs from "fs";
import stream from "stream";
import { config } from "../config";
import BaseModel from "./BaseModel";

export default class EmployeeModel extends BaseModel {
  public readonly bucketName = "cpsc5910-lab7-employee-photos";
  // Create S3 client
  private readonly s3Client = new S3Client({
    credentials: {
      accessKeyId: config.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.AWS_SECRET_ACCESS_KEY
    },
    region: config.AWS_REGION
  });

  public constructor() {
    super("employees");
    this.createSchema();
    this.createModel();
  }

  private createSchema = (): void => {
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

  // process photos
  public uploadEmployeeImage = async (employeeID: string, file: Express.Multer.File) => {
    const fileStream = fs.createReadStream(file.path);

    // Set upload parameters
    const params = {
      Body: fileStream,
      Bucket: this.bucketName,
      Key: this.buildPhotoKey(employeeID, file.originalname),
      ContentType: file.mimetype // adjust this based on the file type
    };

    try {
      // Upload file to S3
      const command = new PutObjectCommand(params);
      const response = await this.s3Client.send(command);
      console.log("File uploaded successfully", response);
      return null;
    } catch (error) {
      console.error("Error uploading file", error);
      return error;
    }
  };

  // Function to get a file from S3
  downloadEmployeeImage = async (employeeID: string, photoName: string): Promise<stream.Readable> => {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: this.buildPhotoKey(employeeID, photoName)
    });

    const response = await this.s3Client.send(command);
    if (response.Body instanceof stream.Readable) {
      return response.Body;
    } else {
      throw new Error("Unexpected response body type");
    }
  };

  public checkIfBucketExists = async (): Promise<boolean> => {
    const command = new HeadBucketCommand({ Bucket: this.bucketName });
    try {
      await this.s3Client.send(command);
      console.log(`Bucket "${this.bucketName}" exists.`);
      return true;
    } catch (error: any) {
      if (error.name === "NotFound") {
        console.log(`Bucket "${this.bucketName}" does not exist.`);
        return false;
      } else {
        console.error(`Error checking if bucket exists: ${error.message}`);
        throw error;
      }
    }
  };

  // Function to create a new bucket
  public createBucket = async () => {
    const command = new CreateBucketCommand({ Bucket: this.bucketName });

    try {
      const response = await this.s3Client.send(command);
      console.log(`Bucket "${this.bucketName}" created successfully.`, response);
      return null;
    } catch (error) {
      console.error(`Error creating bucket: ${error}`);
      return error;
    }
  };

  private buildPhotoKey = (employeeID: string, photoName: string) => {
    return `${employeeID}-${photoName}`;
  };
}
