const { Router } = require("express");
const NotesController = require("../controllers/NotesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");



const notesRoutes = Router();


const notesController = new NotesController ()

notesRoutes.use(ensureAuthenticated)

notesRoutes.get("/", notesController.index);
notesRoutes.get("/get", notesController.getNotes);
notesRoutes.get("/getUserNote/:id", notesController.getNotesByUser);
notesRoutes.get("/:id", notesController.show);
notesRoutes.post("/", notesController.create);
notesRoutes.put("/:userId", notesController.edit);
notesRoutes.delete("/:id", notesController.delete);

module.exports = notesRoutes;