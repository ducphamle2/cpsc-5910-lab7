import { Schema } from "dynamoose/dist/Schema";
import jwt from "jsonwebtoken";
import BaseModel from "./BaseModel";

export default class AuthorizationModel extends BaseModel {
  public constructor() {
    super("authorization");
    this.createSchema();
    this.createModel();
  }
  public readonly expiresIn = "5m";
  public readonly tokenType = "Bearer";

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
          type: "global"
        }
      },
      accessToken: {
        type: String,
        rangeKey: true,
        index: {
          name: "accessTokenIndex",
          type: "global"
        }
      }
    });
  };

  public async validateAccessToken(accessToken: string) {
    const result = (await this.model.query("accessToken").eq(accessToken).exec()).map((data) => data.toJSON());
    if (result.length === 0) {
      throw new Error("Access token not found");
    }
    try {
      jwt.verify(accessToken, result[0].clientSecret, { complete: true });
    } catch (error) {
      return false;
    }
    return true;
  }

  private async getAuthorizationData(clientId: string, clientSecret: string) {
    return this.model.query("clientId").eq(clientId).where("clientSecret").eq(clientSecret).exec();
  }

  public async getContactEmail(contactEmail: string) {
    return (await this.model.query("contactEmail").eq(contactEmail).using("contactEmailIndex").exec()) // Specify the GSI to use
      .map((data) => data.toJSON());
  }

  public async storeNewApplication(data: { clientId: string; clientSecret: string; contactEmail: String }) {
    const accessToken = this.createAccessToken(data.clientId, data.clientSecret);
    const result = await this.model.create({ ...data, accessToken });
    return result.toJSON();
  }

  public createAccessToken(clientId: string, clientSecret: string) {
    const accessToken = jwt.sign({ clientId }, clientSecret, { expiresIn: this.expiresIn });
    return accessToken;
  }

  public async renewAccessToken(clientId: string, clientSecret: string): Promise<any> {
    const authorizationData = await this.getAuthorizationData(clientId, clientSecret);
    if (authorizationData.length === 0) throw new Error("Application not found");
    let record = authorizationData[0];
    record.accessToken = this.createAccessToken(clientId, clientSecret);
    const result = await record.save();
    return result.toJSON();
  }
}
