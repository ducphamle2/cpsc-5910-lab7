import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT || 80,
  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
  MONGO_CONN_TIMEOUT: 1000,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CLIENT_CALLBACK,
  NODE_ENV: process.env.NODE_ENV || "production",
};
