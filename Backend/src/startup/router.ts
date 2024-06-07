import { Express, Request, Response } from "express";
import loginRouter from "../routes/login";
import teamsRouter from "../routes/teams";
import usersRouter from "../routes/users";
import tagsRouter from "../routes/tags";
import questionsRouter from "../routes/questions";
import questionnairesRouter from "../routes/questionnaires";
import dashboardRouter from "../routes/dashboard";

const routerSetup = (app: Express) => {
  app.use("/api/dashboard", dashboardRouter);
  app.use("/api/users", loginRouter);
  app.use("/api/teams", teamsRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/tags", tagsRouter);
  app.use("/api/questions", questionsRouter);
  app.use("/api/questionnaires", questionnairesRouter);
};
export default routerSetup;
