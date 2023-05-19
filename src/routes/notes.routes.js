const { Router } = require("express");
const NotesController = require("../controllers/NotesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");



const notesRoutes = Router();


const notesController = new NotesController ()

// notesRoutes.use(ensureAuthenticated)

notesRoutes.get("/", ensureAuthenticated, notesController.index);
notesRoutes.get("/allNotes", notesController.getAllNotes);
notesRoutes.post("/", ensureAuthenticated, notesController.create);
notesRoutes.get("/:id", ensureAuthenticated, notesController.show);
notesRoutes.delete("/:id", ensureAuthenticated, notesController.delete);

module.exports = notesRoutes;