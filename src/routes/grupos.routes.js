const { Router } = require("express");
const GruposController = require("../controllers/GruposController");
const AddUsersGroupController = require("../controllers/AddUsersGroupController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const gruposRoutes = Router();


const gruposController = new GruposController();
const addUsersGroupController = new AddUsersGroupController();

gruposRoutes.post("/addUser", ensureAuthenticated, addUsersGroupController.update);
gruposRoutes.post("/", ensureAuthenticated, gruposController.create);
gruposRoutes.get("/", ensureAuthenticated, gruposController.index);
gruposRoutes.get("/usergrupos", ensureAuthenticated, gruposController.getGrupoUser);


module.exports = gruposRoutes;