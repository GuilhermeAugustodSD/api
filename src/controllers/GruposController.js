const knex = require("../database/knex");

class GruposController {

  async create(request, response) {
    const { name } = request.body;
    const user_id = request.user.id;

    const [grupos_id] = await knex("grupos").insert({
      name
    });

    await knex("user_grupos").insert({
      user_id,
      grupos_id
    })

    return response.status(201).json();
  }

  async index(request, response) {
    const grupos = await knex("grupos");

    return response.json(grupos);
  }

  async getGrupoUser(request, response) {
    const user_id = request.user.id;

    const userGrupos = await knex("user_grupos").where({ user_id });
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
      };

    })



    // console.log(grupoUser);

    return response.json(grupoUser);
  }

  async getAllGroups(require, response) {

    const allGroups = await knex('grupos')
    const userGrupos = await knex("user_grupos")
    const allNotes = await knex("notes")

    const allData = allGroups.map(group => {
      const notes = allNotes.filter(note => note.grupos_id === group.id)
      const usersId = userGrupos.filter(userGrupo => userGrupo.grupos_id === group.id)
      console.log(usersId)
      return {
        ...group,
        users: usersId,
        notes
      }
    })
    return response.json(allData)
  }

  async getGroup(require, response) {
    const { id } = require.params

    const [group] = await knex("grupos")
      .select('name', 'id')
      .where('id', id)

    const groupUsers = await knex("user_grupos").where('grupos_id', id)
    const notes = await knex('notes').where('grupos_id', id)
    const tags = await knex("tags");
    const links = await knex("links")
    const checklist = await knex("checklist")
    const users = await knex('users')
    const perfis = await knex("perfis")

    const usersPerfil = users.map(user => {
      const perfil = perfis.filter(perfil => perfil.id === user.perfil)
      return {
        ...user,
        perfil
      }
    })

    const usersbyGroup = groupUsers.map(groupUser => {
      const [data] = usersPerfil.filter(user => user.id === groupUser.user_id)
      return {
        ...data
      }
    })

    const completeNote = notes.map(note => {
      const noteTags = tags.filter(tag => tag.note_id === note.id);
      const noteLink = links.filter(link => link.note_id === note.id);
      const noteChecklist = checklist.filter(check => check.note_id === note.id);

      return {
        ...note,
        tags: noteTags,
        url: noteLink,
        checklist: noteChecklist
      };
    })

    group['users'] = (usersbyGroup)
    group['notes'] = (completeNote)

    return response.json([{
      ...group
    }])

  }

  async delGroupUser(request, response) {
    const { id } = request.params;

    await knex("user_grupos").where('user_id', id)

    return response.json()


  }


}

module.exports = GruposController;