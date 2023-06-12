exports.up = knex => knex.schema.createTable("users_notas_favoritas", table =>{
    table.increments("id");
    table.integer("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.integer("note_id").references("id").inTable("notes").onDelete("CASCADE");
    table.binary("nota_favorita"); 
    
});

exports.down = kenx => knex.schema.dropTable("users_notas_favoritas");
