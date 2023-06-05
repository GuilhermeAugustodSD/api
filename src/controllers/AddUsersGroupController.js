const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class AddUsersGroupController {

    async update(request, response ) {
        const { email, grupos_id } = request.query;
        const [ user ] = await knex("users").where({email});

        if (!email) {
            throw new AppError("Preencha o campo de email")
        }

        if (!user) {
            throw new AppError("Este e-mail não existe na base de dados!")
        }

        const userGrupos = {
            user_id: user.id,
            grupos_id
        }
        
        await knex("user_grupos").insert(userGrupos);

        return response.json(user);
    }
}

module.exports = AddUsersGroupController;