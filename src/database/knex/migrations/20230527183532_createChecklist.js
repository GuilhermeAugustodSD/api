exports.up = knex => knex.schema.createTable("checklist", table =>{
    table.increments("id");
    table.text("title").notNullable();
    table.boolean("status");
    table.integer("note_id").references("id").inTable("notes").onDelete("CASCADE");
    table.timestamp("created_at").default(knex.fn.now());
    
});

exports.down = kenx => knex.schema.dropTable("checklist");

