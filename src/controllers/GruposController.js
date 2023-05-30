const knex = require("../database/knex");

class GruposController {

    async create(request, response) {
      const { name } = request.body;
      const user_id  = request.user.id;

      const [ grupos_id ] = await knex("grupos").insert({
        name
      });

      await knex("user_grupos").insert({
        user_id,
        grupos_id
      })
  
      return response.status(201).json();
    }

    async index(request, response){
      const grupos = await knex("grupos");
      
      return response.json(grupos);
    }

    async getGrupoUser(request, response) {
      const user_id  = request.user.id;

      const userGrupos = await knex("user_grupos").where({user_id});
        const gruposAll = await knex("grupos");
      
      // const grupoUser = userGrupos.map((grupo, index) => {
      //   console.log(grupo.grupos_id);
      //   // const gruposFilter = gruposAll.filter(gru => gru.id === grupo.grupos_id);

      //   return gruposAll;
        
      // }) 
      const grupoUser = await userGrupos.map(grupo => {
        const gruposFilter = gruposAll.filter(gru => gru.id === grupo.grupos_id);

        return {
          ...gruposFilter
        } ;
        
      }) 

      

      // console.log(grupoUser);

      return response.json(grupoUser);
    }


}

module.exports = GruposController;