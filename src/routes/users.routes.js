const { Router } = require("express");
const UsersController = require("../controllers/UsersController");
const UserAvatarController = require("../controllers/UserAvatarController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const multer = require("multer");
const uploadConfig = require("../configs/upload");


const upload = multer(uploadConfig.MULTER);


const usersRoutes = Router();


const usersController = new UsersController ()
const userAvatarController = new UserAvatarController ()

usersRoutes.get("/", usersController.getUsers)
usersRoutes.get("/:id", usersController.getUsersById)
usersRoutes.post("/", usersController.create);
usersRoutes.put("/", ensureAuthenticated, usersController.update);
usersRoutes.put("/:id", usersController.updateAllUsers);
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarController.update);
usersRoutes.patch("/anyAvatar/:id", upload.single("avatar"), userAvatarController.updateAnyUser);
usersRoutes.delete("/:id", usersController.deleteUsers);

module.exports = usersRoutes;