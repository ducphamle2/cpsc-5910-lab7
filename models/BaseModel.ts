import { Connection, Schema } from "mongoose";

abstract class BaseModel {
  protected schema: Schema;
  protected connection: Connection;

  public constructor(connection: Connection, protected collectionName: string) {
    this.connection = connection;
  }
}

export default BaseModel;
