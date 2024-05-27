import dynamoose from "dynamoose";
import { config } from "./config";

// Create new DynamoDB instance
const ddb = new dynamoose.aws.ddb.DynamoDB({
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY
  },
  region: config.AWS_REGION
});

// Set DynamoDB instance to the Dynamoose DDB instance
dynamoose.aws.ddb.set(ddb);

export default ddb;
