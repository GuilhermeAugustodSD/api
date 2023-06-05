exports.up = knex => knex.schema.createTable("grupos", table =>{
    table.increments("id");
    table.text("name").notNullable();
    
});

exports.down = kenx => knex.schema.dropTable("grupos");

