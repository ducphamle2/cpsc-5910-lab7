import { config } from "./config";
import AuthorizationModel from "./models/AuthorizationModel";
import { initServer } from "./server";

const port = config.PORT as number;
const host = "0.0.0.0";

(async () => {
  const authorizationModel = new AuthorizationModel();
  const server = initServer({
    authorizationModel
  });
  server.listen(port, host, async () => {
    console.log(`⚡️[server]: Authorization Service is running at http://${host}:${port}`);
  });
})();
