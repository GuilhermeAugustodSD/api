const { response } = require("express");
const knex = require("../database/knex");
const sqliteConnection = require("../database/sqlite");
const AppError = require("../utils/AppError");


class NotesController {
  async create(request, response) {
    const { title, description, restricao_nota, nota_favorita, nota_compartilhada, tags, links, grupos_id, checklist } = request.body;

    const user_id = request.user.id;

    const [note_id] = await knex("notes").insert({
      title,
      description,
      restricao_nota,
      nota_favorita,
      nota_compartilhada,
      user_id,
      grupos_id: grupos_id ? grupos_id : null

    });

    if (checklist){
      const checklistInsert = await checklist.map(name => {
        return {
          note_id,
          title: name
        }
      })
  
      await knex("checklist").insert(checklistInsert);
    }

    if (links){
      const linksInsert = await links.map(link => {
        return {
          note_id,
          url: link
        }
      })
  
      await knex("links").insert(linksInsert);
    }

    if (tags) {
      const tagsInsert = await tags.map(name => {
        return {
          note_id,
          name,
          user_id
        }
      })
      
      await knex("tags").insert(tagsInsert);
    }

    return response.json();
  }

  async getNotes(request, response) {
    const notes = await knex('notes')

    return response.json(notes)
  }

  async getNotesByUser(request, response) {
    const { id } = request.params

    const notes = await knex("notes")
      .where('notes.user_id', id)

    const links = await knex("links")
      .select("links.id", 'url', "links.note_id")
      .innerJoin("tags", "tags.note_id", "links.note_id")
      .where({ user_id: id })

    const tags = await knex("tags").where({ user_id: id }).orderBy("name");

    console.log(links)
    const allNotes = notes.map(note => (
      {
        id: note.id,
        title: note.title,
        description: note.description,
        user_id: note.user_id,
        url: links.filter(link => link.note_id === note.id),
        tags: tags.filter(tag => tag.note_id === note.id),
        created_at: note.created_at
      }
    ))

    return response.json(
      allNotes

    );
  }


  async show(request, response) {
    const { id } = request.params;

    const note = await knex("notes").where({ id }).first();

    const tags = await knex("tags").where({ note_id: id}).orderBy("name");
    const links = await knex("links").where({ note_id: id}).orderBy("created_at");
    const checklist = await knex("checklist").where({ note_id: id}).orderBy("created_at");

    return response.json({
      ...note,
      tags,
      links,
      checklist
    });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("notes").where({ id }).delete();

    return response.json();
  }

  async index(request, response) {
    const { title, tags } = request.query;
    const user_id = request.user.id;

    let notes;

    if (tags) {
      const filterTags = tags.split(',').map(tag => tag.trim());

      notes = await knex("tags")
        .select([
          "notes.id",
          "notes.title",
          "notes.user_id",
        ])
        .where("notes.user_id", user_id)
        .whereLike("notes.title", `%${title}%`)
        .whereIn("name", filterTags)
        .innerJoin("notes", "notes.id", "tags.note_id")
        .groupBy("notes.id")
        .orderBy("notes.title");

    } else {
      notes = await knex("notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");

    }

    const userTags = await knex("tags").where({ user_id });
    const notesWithTags = notes.map(note => {
      const noteTags = userTags.filter(tag => tag.note_id === note.id);

      return {
        ...note,
        tags: noteTags
      };
    });


    return response.json(notesWithTags)
  }

  async update(request, response) {
    const { id, title, description, restricao_nota, nota_compartilhada, nota_favorita } = request.body;
    const user_id  = request.user.id;
    const notes = knex("notes").where({user_id});
    console.log(notes);
    notes.nota_favorita = nota_compartilhada ?? notes.nota_compartilhada;
    /* ajustar */
  }


  async edit(request, response) {

    const { noteId, noteTitle, noteDescription, noteTag, noteUrl } = request.body
    const user_id = Number(request.params.userId);
    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

    if (!user) {
      throw new AppError("Usuário não encontrado!");
    }

    const updateNote = await database.get(`
    SELECT *
    FROM notes 
    WHERE id = (?)`, [noteId])

    const updateTags = await knex("tags")
      .where({ note_id: noteId })


    updateNote.title = noteTitle ?? updateNote.title;
    updateNote.description = noteDescription ?? updateNote.description

    
    database.run(`
    UPDATE notes SET
    title = ?,
    description = ?,
    updated_at = DATETIME('now')
    WHERE id = ?`,
    [updateNote.title, updateNote.description, noteId]
     
    );
    
    noteTag.map(tag =>
      database.run(
        `
        UPDATE tags SET
        name = ?
        where id = ? `,
          [tag.name, tag.id]
        ))
    
    noteUrl.map(url =>
      database.run(
        `
        UPDATE links SET
        url = ?
        where id = ? `,
          [url.url, url.id]
        ))
    

    return response.json();
  }
  async getAllNotes(request, response) {

    const allNotes = await knex("notes").where("restricao_nota", 0);
    const tags = await knex("tags");
    const links = await knex("links")
    const checklist = await knex("checklist")
    const notesWithTags = allNotes.map(note => {
      const noteTags = tags.filter(tag => tag.note_id === note.id);
      const noteLink = links.filter(link => link.note_id === note.id);
      const noteChecklist = checklist.filter(check => check.note_id === note.id);

      return {
        ...note,
        tags: noteTags,
        link: noteLink,
        checklist: noteChecklist
      };
    });
    

    return response.json(notesWithTags);
  }

  async putFavNotes(request, response) {
    const { note_id } = request.params;

    const notes = await knex("notes").where({ id: note_id }).first();

    if (notes.nota_favorita == 1) {
      notes.nota_favorita = 0;

    }else {
      notes.nota_favorita = 1;
    }

    await knex("notes").update(notes).where({ id: note_id });

    return response.json();
  }

  async getAllNotesFav(request, response) {

    const allNotes = await knex("notes").where("nota_favorita", "1");
    const tags = await knex("tags");
    const links = await knex("links")
    const checklist = await knex("checklist")
    const notesWithTags = allNotes.map(note => {
      const noteTags = tags.filter(tag => tag.note_id === note.id);
      const noteLink = links.filter(link => link.note_id === note.id);
      const noteChecklist = checklist.filter(check => check.note_id === note.id);

      return {
        ...note,
        tags: noteTags,
        link: noteLink,
        checklist: noteChecklist
      };
    });
    

    return response.json(notesWithTags);
  }

  async getNotesGrupos(request, response){
    const { grupos_id } = request.params;
    const allNotes = await knex("notes").where("grupos_id", grupos_id);
    const tags = await knex("tags");
    const links = await knex("links")
    const notesWithTags = allNotes.map(note => {
      const noteTags = tags.filter(tag => tag.note_id === note.id);
      const noteLink = links.filter(link => link.note_id === note.id);

      return {
        ...note,
        tags: noteTags,
        link: noteLink
      };
    });

    return response.json(notesWithTags);
  }


}

module.exports = NotesController;