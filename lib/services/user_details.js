const Util = require('util');
const Schmervice = require('schmervice');
const SecurePassword = require('secure-password');
const JWT = require('jsonwebtoken');
const fs = require('fs');
const Dotenv = require('dotenv');
const _ = require('underscore');
const CONSTANTS = require('../constants');
const { OAuth2Client } = require('google-auth-library');
// const CONSTANTS = require('../constants');
// const sendEmail = require('../helpers/sendEmail');

Dotenv.config({ path: `${__dirname}/../.env` });

module.exports = class K_Details_Service extends Schmervice.Service {


  async findById(id, txn) {
    const { Students_details } = this.server.models();

    const user = await Students_details.query(txn).throwIfNotFound().findById(id);
    return user;
  }

  async findAll(txn) {
    const { Students_details } = this.server.models();
    const students_details = await Students_details.query(txn);

    return students_details;
  }

  async create(details, txn=null) {
    const { Students_details } = this.server.models();

    const students_details = await Students_details.query(txn).insertGraph(details);
    return students_details;
  }

// update the users deatils if it exist in database.

async userUpdate(userId, k_details, txn = null) {
  const details = k_details
  console.log(details);
  
  const { Students_details } = this.server.models();

  const updateUser = await Students_details.query(txn)
    .update(details)
    .where({ id: userId });
  return updateUser;
}
};