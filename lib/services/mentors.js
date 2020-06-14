
const Util = require('util');
const Schmervice = require('schmervice');
const SecurePassword = require('secure-password');
const JWT = require('jsonwebtoken');
const fs = require('fs');
const Dotenv = require('dotenv');
const _ = require('underscore');
const CONSTANTS = require('../constants');
const { OAuth2Client } = require('google-auth-library');
const { role } = require('../config/index');


Dotenv.config({ path: `${__dirname}/../.env` });

module.exports = class Mentors_service extends Schmervice.Service {

  async findAll(txn) {
    const { Mentors } = this.server.models();
    const Mentors_data = await Mentors.query(txn).eager({
      users: true
    });

    return Mentors_data;
  }

  async create(details, txn = null) {
    const { Mentors } = this.server.models();
    const Scope_data = await Mentors.query(txn).insertGraph(details);
    return Scope_data;
  }

  async mentorsInfoUpdate(id, details, txn) {
    const { Mentors } = this.server.models();
    await Mentors.query(txn)
      .update(details)
      .where({ "user_id": id });
    const updated_data = this.findOneWithUser(id)
    return updated_data;
  }

  async findOneWithUser(id) {
    const { Mentors } = this.server.models();
    const data = await Mentors.query().eager({
      users: true
    }).where('user_id', id)
    return data;
  }

  async deleteMentorsData(id, txn) {
    const { Mentors } = this.server.models();
    const deleteData = await Mentors.query(txn)
      .del()
      .where({ "user_id": id })
    return deleteData;
  }

  async verifyRole(email) {
    let UserConf = Object.keys(role).map((value) => {
      if (role[value].includes(email)) {
        return true
      }
    })
    return UserConf.includes(true);
  }
};