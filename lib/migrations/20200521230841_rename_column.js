exports.up = async (knex, Promise) => {
    await knex.schema.table('users', (table) => {
        table.renameColumn('profilepicture', 'profilePicture');
        table.renameColumn('googleuserid', 'googleUserId');
        table.renameColumn('githublink', 'githubLink');
        table.renameColumn('linkedinlink', 'linkedinLink');
        table.renameColumn('mediumlink', 'mediumLink');
    })
};

exports.down = async (knex, Promise) => {
    // const dropTable = await knex.schema.dropTable('users');
    //   return dropTable;  
};