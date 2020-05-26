
exports.up = async (knex, Promise) => {
  await knex.schema.createTable('ng-joined-users', (table) => {
    table.increments('id').notNullable();
    table.string('email').notNullable();
    table.string('name').notNullable();
    table.string('profile_picture').notNullable();
    table.string('google_user_id').notNullable();
    table.string('center').notNullable();
    table.string('github_link').notNullable();
    table.string('linkedin_link').notNullable();
    table.string('medium_link').notNullable();
    table.datetime('created_at').notNullable();
  });
};

exports.down = async (knex, Promise) => {
  // const dropTable = await knex.schema.dropTable('ng-joined-users');
  // return dropTable;
};