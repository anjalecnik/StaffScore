import { Express, Request, Response } from "express";
import loginRouter from "../routes/login";

const routerSetup = (app: Express) => {
  app.get("/", async (req: Request, res: Response) => {
    res.send("Hello Express APIvantage!");
  });

  app.use("/api/users", loginRouter);
};
export default routerSetup;
