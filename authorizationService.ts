import { config } from "./config";
import AuthorizationModel from "./models/AuthorizationModel";
import { initServer } from "./server";
import { Middleware } from "./services/middleware";

const port = config.PORT as number;
const host = "0.0.0.0";

(async () => {
  const authorizationModel = new AuthorizationModel();
  const middleware = new Middleware();
  const server = initServer(
    {
      authorizationModel
    },
    middleware
  );
  server.listen(port, host, async () => {
    console.log(`⚡️[server]: Authorization Service is running at http://${host}:${port}`);
  });
})();
