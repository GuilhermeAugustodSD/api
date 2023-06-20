const { Router } = require("express");

const usersRouter = require("./users.routes");
const notesRouter = require("./notes.routes");
const tagsRouter = require("./tags.routes");
const sessionsRouter = require("./sessions.routes");
const gruposRouter = require("./grupos.routes");
const perfisRoutes = require("./perfis.routes");

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/notes", notesRouter);
routes.use("/tags", tagsRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/grupos", gruposRouter);
routes.use("/perfis", perfisRoutes);

module.exports = routes;