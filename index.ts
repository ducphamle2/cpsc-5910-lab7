import { config } from "./config";
import EmpployeeModel from "./models/EmployeeModel";
import { initServer } from "./server";
import { Middleware } from "./services/middleware";

const port = config.PORT as number;
const host = "0.0.0.0";

(async () => {
  const employeeModel = new EmpployeeModel();
  try {
    await employeeModel.createTable();
  } catch (error) {}
  const middleware = config.NODE_ENV === "development" ? undefined : new Middleware();
  const server = initServer(
    {
      employeeModel
    },
    middleware
  );
  server.listen(port, host, async () => {
    console.log(`⚡️[server]: Server is running at http://${host}:${port}`);
  });
})();
