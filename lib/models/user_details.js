
// const Schwifty = require('schwifty');
const Joi = require('joi');
const { Model } = require('./helpers');

module.exports = class Students_details extends Model {
  static get tableName() {
    return 'k_details';
  }

  static get joiSchema() {
    return Joi.object({
      id: Joi.number().integer().greater(0),
      name: Joi.string(),
      email: Joi.string(),
      profile_pic: Joi.string(),
      indemnity_form: Joi.string(),
      parents_name: Joi.string(),
      address: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      pin_code: Joi.string(),
      created_at: Joi.date()
    });
  }

  $beforeInsert() {
    const now = new Date();
    this.created_at = now;
  }
};