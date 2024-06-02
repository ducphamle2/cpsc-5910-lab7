import { App, Models } from "./App";

export const initServer = (models: Models) => {
  let app = new App(models);
  app.routes();
  const server = app.express;
  return server;
};
