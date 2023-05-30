exports.up = knex => knex.schema.createTable("arquivos", table =>{
    table.increments("id");
    table.text("name").notNullable();
    table.integer("note_id").references("id").inTable("notes").onDelete("CASCADE");
    
});

exports.down = kenx => knex.schema.dropTable("arquivos");