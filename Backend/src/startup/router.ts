import { Express, Request, Response } from "express";
import loginRouter from "../routes/login";
import teamsRouter from "../routes/teams";
import usersRouter from "../routes/users";

const routerSetup = (app: Express) => {
  app.get("/", async (req: Request, res: Response) => {
    res.send("Hello Express APIvantage!");
  });

  app.use("/api/users", loginRouter);
  app.use("/api/teams", teamsRouter);
  app.use("/api/users", usersRouter);
};
export default routerSetup;
