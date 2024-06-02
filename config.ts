import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT || 80,
  MONGO_CONN_TIMEOUT: 1000,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CLIENT_CALLBACK,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.REGION || "us-east-1",
  AUTHORIZATION_SERVICE_URL: process.env.AUTHORIZATION_SERVICE_URL
};
