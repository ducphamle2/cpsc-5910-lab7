import mongoose from "mongoose";

export default interface IEmployeeModel extends mongoose.Document {
  authID: string;
  userID: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePic: string;
}
