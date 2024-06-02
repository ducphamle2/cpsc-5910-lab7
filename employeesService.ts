import { config } from "./config";
import EmpployeeModel from "./models/EmployeeModel";
import { initServer } from "./server";
import { Middleware } from "./services/middleware";

const port = config.PORT as number;
const host = "0.0.0.0";

(async () => {
  const employeeModel = new EmpployeeModel();
  const middleware = new Middleware();
  const server = initServer(
    {
      employeeModel
    },
    middleware
  );
  server.listen(port, host, async () => {
    console.log(`⚡️[server]: Employee Service is running at http://${host}:${port}`);
  });
})();
