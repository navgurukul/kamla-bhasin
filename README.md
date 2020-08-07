# Kadadm Backend

## How to run the Project?

0. Ensure you are using Node version v10.16.0
1. `npm install` to install the dependencies
2. Set up the DB in MySQL. Read the `How to use Knex Migrations?` section.
3. Create a .env file in the root directory of the project and update the required variables. You can use `sample.env` as the skeleton.
4. `npm start` to run the server. The server will run with auto reloading using nodemon.

## Good Practices

### Linting

Code should be properly linted before any pull request is merged into the `master`. `npm run lint` to see all the linting errors. In cases where exceptions need to be made and a particular linting error cannot be fixed use the following code above the concerned line.

```javascript
// eslint-disable-next-line no-useless-escape
```

Here `no-useless-escape` is the rule which needs to be ignored for the line below.

### Constants

Don't hard code any values in the code whatsoever. Try to always declare the values in `lib/constants.js` instead of declaring them anywhere in the code. Here's an example on how we declared the current mode in constants and then used it across the code.

```javascript
{
  mode: process.env.NODE_ENV,
  supportedModes: {
    prod: 'production',
    dev: 'development',
  },
}
```

The above snippet is from `lib/constants.js`. Now to write a conditional logic on basis of the mode which the server is running under right now, we wrote the following code in `lib/services/exotel.js`

```javascript
if (CONSTANTS.mode !== CONSTANTS.supportedModes.prod) {
  // do something here
}
```

The mode is not picked from the `process.env` neither is the value to which it is compared.

### Services

All the heavy business logic should exist strictly in the concerned services. No logic should be there in any helper file or the API endpoints

## How to use Knex Migrations?

The initial schema created while developing Chanakya is not created as a Knex migration but stored in a SQL file in `sqlScripts/initialSchema.sql`. When you are installing Chanakya for the first time you need to first import this schema into the MySQL DB.

After importing the schema you can run the migrations using `npm run knex migrate:latest`.

*Note: Check `Import Schema` section under `Important Commands` to see how to import the initialSchema.sql file into your DB.*

## Important Commands

### Export Schema of DB

    mysqldump -u root -p --no-data chanakya > schema.sql

### Import Schema

    mysql -u <insert your username> -p chanakya < sqlScripts/initialSchema.sql

 

### Run server with Auto Reload
`first you have to run this command`

    npm run build 

`Then you can start server through this`

    npm start
