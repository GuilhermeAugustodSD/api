const { Router } = require("express");
const NotesController = require("../controllers/NotesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");



const notesRoutes = Router();


const notesController = new NotesController ()

notesRoutes.use(ensureAuthenticated);

notesRoutes.get("/", notesController.index);
notesRoutes.get("/get", notesController.getNotes);
notesRoutes.get("/allNotes", notesController.getAllNotes);
notesRoutes.get("/allNotes/:id", notesController.showAllNotes);
notesRoutes.get("/allNotesFav", notesController.getAllNotesFav);
notesRoutes.get("/noteGrupo/:grupos_id", notesController.getNotesGrupos);
notesRoutes.get("/getUserNote/:id", notesController.getNotesByUser);
notesRoutes.get("/:id", notesController.show);
notesRoutes.post("/", notesController.create);
notesRoutes.delete("/:id", notesController.delete);
notesRoutes.put("/:userId", notesController.edit);
notesRoutes.post("/favorites", notesController.put);

notesRoutes.put("/favorite/:note_id", notesController.putFavNotes);

module.exports = notesRoutes;