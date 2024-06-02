import { model } from "dynamoose";
import { Model } from "dynamoose/dist/Model";
import { Schema } from "dynamoose/dist/Schema";

abstract class BaseModel {
  protected schema: Schema;
  protected model: Model;

  public constructor(protected collectionName: string) {}

  protected createModel = () => {
    if (!this.model) {
      this.model = model(this.collectionName, this.schema, { initialize: true, tableName: this.collectionName });
      this.model
        .table()
        .initialize()
        .then(
          () => {},
          () => {}
        );
    }
  };
}

export default BaseModel;
