exports.up = knex => knex.schema.createTable("perfis", table =>{
    table.increments("id");
    table.text("perfil_name").notNullable();
    
});

exports.down = kenx => knex.schema.dropTable("perfis");