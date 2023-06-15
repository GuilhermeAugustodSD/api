const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class PerfisController {

    async getPerfis(request, response ) {
        
        const perfis = await knex("perfis");

        return response.json(perfis);
    }
}

module.exports = PerfisController;