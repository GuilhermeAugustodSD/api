const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const sqliteConnection = require("../database/sqlite");
const { response } = require("express");

class UsersController {

  async getUsers(request, response) {

    const users = await knex("users")

    return response.json(users)
  }

  async getUsersById(request, response) {
    const { id } = request.params;

    const users = await knex("users").where({ id })


    return response.json(users);
  }

  async deleteUsers(request, response) {
    const { id } = request.params;

    const note_id = await knex("notes")
      .select("id")
      .where({ user_id: id })


    await knex("links").where({ note_id }).del()
    await knex("tags").where({ note_id }).del()
    await knex("notes").where({ user_id: id }).del()
    await knex("users").where({ id: id }).del()

    return response.json()
  }

  async create(request, response) {
    const {
      name,
      email,
      password
    } = request.body;

    const database = await sqliteConnection();
    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

    if (checkUserExists) {
      throw new AppError("Este e-mail já está em uso")
    }
    const hashedPassword = await hash(password, 8);

    await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const user_id = request.user.id;


    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

    if (!user) {
      throw new AppError("Usuário não encontrado!");
    }

    const userWithUpdateEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

    if (userWithUpdateEmail && userWithUpdateEmail.id !== user.id) {
      throw new AppError("Este e-mail já está em uso.")
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) {
      throw new AppError("Você precisa informar a senha antiga para definir a nova senha");
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("Senha antiga não confere!");
      }

      user.password = await hash(password, 8);
    }

    await database.run(`
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user.password, user_id]
    );

    return response.json();
  }

  async updateAllUsers(request, response) {
    const senhaAdmin = '0000'
    const { name, email, password } = request.body;
    const user_id = Number(request.params.id);

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);


    if (!user) {
      throw new AppError("Usuário não encontrado!");
    }

    const userWithUpdateEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

    if (userWithUpdateEmail && userWithUpdateEmail.id !== user.id) {
      throw new AppError("Este e-mail já está em uso.")
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (!password) {
      throw new AppError("É preciso informar senha de administrador");
    }
    if (password !== senhaAdmin) {
      throw new AppError("Senha de admin não confere!");
    }



    await database.run(`
      UPDATE users SET
      name = ?,
      email = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user_id]
    );

    return response.json();

  }

  
  
}

module.exports = UsersController;