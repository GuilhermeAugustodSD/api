const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage")

class UserAvatarController {

    async update(request, response) {
        const user_id = request.user.id;
        const avatarFileName = request.file.filename;


        const diskStorage = new DiskStorage();

        const user = await knex("users")
        .where({ id: user_id }).first();

        if (!user) {
            throw AppError("Somente usuários autenticados podem mudar a foto de perfil", 401);
        }

        if(user.avatar){
            await diskStorage.deleteFile(user.avatar);
        }

        const filename = await diskStorage.saveFile(avatarFileName);
        user.avatar = filename;

        await knex("users").update(user).where({ id: user_id });

        return response.json(user)
    }

    async updateAnyUser(request, response) {
        const user_id = Number(request.params.id);
        const avatarFileName = request.file.filename;

        console.log('a')
        const diskStorage = new DiskStorage();

        const user = await knex("users")
        .where({ id: user_id }).first();

        if (!user) {
            throw AppError("Somente usuários autenticados podem mudar a foto de perfil", 401);
        }

        if(user.avatar){
            await diskStorage.deleteFile(user.avatar);
        }

        const filename = await diskStorage.saveFile(avatarFileName);
        user.avatar = filename;

        await knex("users").update(user).where({ id: user_id });

        return response.json(user)
    }
    
}

module.exports = UserAvatarController;