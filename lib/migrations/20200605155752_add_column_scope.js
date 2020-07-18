
exports.up = async (knex, Promise) => {
    await knex.schema.table('mentors', (table) => {
        table.string('scope');
        table.integer('user_id').unsigned();
        table.foreign('user_id').references('id').inTable('users');
        table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'))
    })
};

exports.down = async (knex, Promise) => {
    const dropfeild = await knex.schema.table('mentors', (table) => {
        table.dropColumn("scope");
        table.dropForeign("user_id");
        table.dropColumn("user_id");
        table.dropColumn("created_at");
    });
    return dropfeild;  
};