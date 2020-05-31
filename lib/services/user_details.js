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
const {role} = require('../config/index')

Dotenv.config({ path: `${__dirname}/../.env` });

module.exports = class K_Details_Service extends Schmervice.Service {


  async findById(id, txn) {
    const { Students_details } = this.server.models();
    

    const user = await Students_details.query(txn).throwIfNotFound().findById(id);
    return user;
  }

  async verifyRole(email){

    const {SuperAdmin,Admin} = role;
    
    if (SuperAdmin.includes(email)){
      return'SuperAdmin'
    }else if (Admin.includes(email)){
      return 'Admin'
    }else{
      return 'Student'
    }
  }


  async findByEmail(email) {
    const { Students_details } = this.server.models();
    const user = await Students_details.query().where({'email':email})
    return user
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

  async userUpdate(email, details, txn) {
    const { Students_details } = this.server.models();
    const updateUser = await Students_details.query(txn)
      .update(details)
      .where({ email: email });
    return updateUser;
  }

  async deleteUser (email, txn) {
    const { Students_details} = this.server.models();
    const deleteUser = await Students_details.query(txn)
      .where({email : email})
      .del();
    return deleteUser;
  }
  
};