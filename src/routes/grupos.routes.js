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
gruposRoutes.get("/gruposUsers/:userId", gruposController.getUsergruposUsers);
gruposRoutes.get("/AllGroups", gruposController.getAllGroups);
gruposRoutes.get("/view/:id", gruposController.getGroup);
gruposRoutes.delete("/del/:id", gruposController.delGroupUser);


module.exports = gruposRoutes;