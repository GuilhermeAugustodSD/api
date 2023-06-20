const { Router } = require("express");
const AddUsersGroupController = require("../controllers/AddUsersGroupController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const PerfisController = require("../controllers/PerfisController");

const perfisRoutes = Router();


const perfisController = new PerfisController();

perfisRoutes.get("/getAll", ensureAuthenticated, perfisController.getPerfis);


module.exports = perfisRoutes;