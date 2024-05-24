import express from "express";
import appSetup from "../src/startup/init";
import routerSetup from "../src/startup/router";
import securitySetup from "../src/startup/security";

const app = express();

appSetup(app);
securitySetup(app, express);
routerSetup(app);
