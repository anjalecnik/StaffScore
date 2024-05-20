import { Express } from "express";

const appSetup = (app: Express) => {
  const APP_PORT = 3000;

  app.listen(APP_PORT, () => {
    console.log(`Server started on port ${APP_PORT}`);
  });
};

export default appSetup;
