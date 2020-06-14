
exports.up = async (knex, Promise) => {
    await knex.schema.table('k_details', (table) => {
        table.string('email').notNullable();
        table.string('profile_pic').notNullable();
        table.string('indemnity_form').notNullable();
        table.boolean('deleted');
    })
};

exports.down = async (knex, Promise) => {
    const dropfeild = await knex.schema.table('k_details', (table) => {
        table.dropColumn("email");
        table.dropColumn("profile_pic");
        table.dropColumn("indemnity_form");
        table.dropColumn("deleted");
    });
    return dropfeild;  
};