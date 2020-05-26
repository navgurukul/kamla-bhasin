
exports.up = async (knex, Promise) => {
    await knex.schema.table('k_details', (table) => {
        table.string('email').notNullable();
        table.string('profilePic').notNullable();
        table.string('indemnityForm').notNullable();
    })
};

exports.down = async (knex, Promise) => {
    // const dropTable = await knex.schema.dropTable('k_details');
    //   return dropTable;  
};