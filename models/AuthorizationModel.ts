import * as dynamoose from "dynamoose";
import { Schema } from "dynamoose/dist/Schema";
import BaseModel from "./BaseModel";

export default class AuthorizationModel extends BaseModel {
  public constructor() {
    super("authorization");
    this.createSchema();
    this.createModel();
  }

  private createSchema = (): void => {
    this.schema = new Schema({
      clientId: {
        type: String,
        hashKey: true
      },
      clientSecret: String,
      contactEmail: {
        type: String,
        index: {
          name: "contactEmailIndex",
          type: "local"
        }
      },
      accessToken: {
        type: String,
        rangeKey: true
      }
    });
  };

  public async validateAccessToken(accessToken: string) {
    return (await this.model.query("accessToken").eq(accessToken).exec()).map((data) => data.toJSON());
  }

  public async getAuthorizationData(clientId: string, clientSecret: string) {
    const queryCondition = new dynamoose.Condition()
      .where("clientId")
      .eq(clientId)
      .and()
      .where("clientSecret")
      .eq(clientSecret);
    return (await this.model.query(queryCondition).exec()).map((data) => data.toJSON());
  }

  public async getContactEmail(contactEmail: string) {
    return (await this.model.query("contractEmail").eq(contactEmail).exec()).map((data) => data.toJSON());
  }
}
