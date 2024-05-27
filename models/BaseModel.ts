import { model } from "dynamoose";
import { Model } from "dynamoose/dist/Model";
import { Schema } from "dynamoose/dist/Schema";

abstract class BaseModel {
  protected schema: Schema;
  public model: Model;

  public constructor(protected collectionName: string) {}

  public createModel = () => {
    if (!this.model) {
      this.model = model(this.collectionName, this.schema);
    }
  };
}

export default BaseModel;
