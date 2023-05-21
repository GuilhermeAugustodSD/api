exports.up = knex => knex.schema.createTable("notes", table =>{
    table.increments("id");
    table.text("title");
    table.text("description");
    table.binary("restricao_nota"); 
    table.binary("nota_favorita"); 
    table.binary("nota_compartilhada"); 
    table.integer("user_id").references("id").inTable("users");
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());

});

exports.down = kenx => knex.schema.dropTable("notes");
