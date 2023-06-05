exports.up = knex => knex.schema.createTable("user_grupos", table =>{
    table.integer("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.integer("grupos_id").references("id").inTable("grupos").onDelete("CASCADE");
    
});

exports.down = kenx => knex.schema.dropTable("user_grupos");

