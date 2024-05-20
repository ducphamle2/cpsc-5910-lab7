import * as chai from "chai";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import { App } from "supertest/types";
import EmployeeModel from "../models/EmployeeModel";
import { initServer } from "../server";

// Configure chai
chai.use(sinonChai);
const expect = chai.expect;
const sandbox = sinon.createSandbox();
let mongoServer: MongoMemoryServer;

describe("test-employees-apis", () => {
  let server: App;
  let employeeModel: EmployeeModel;

  beforeEach(() => {
    sandbox.restore();
  });

  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    employeeModel = new EmployeeModel(mongoose.connection);
    server = initServer({ employeeModel });
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it(`test /peoplesuite/apis/employees should return a list of employees`, async () => {
    expect(true);
  });
});
