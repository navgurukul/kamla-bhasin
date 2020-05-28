
// const Schwifty = require('schwifty');
const Joi = require('joi');
const { Model } = require('./helpers');

module.exports = class Students extends Model {
  static get tableName() {
    return 'users';
  }

  static get joiSchema() {
    return Joi.object({
      id: Joi.number().integer().greater(0),
      name: Joi.string().required(),
      email: Joi.string().required(),
      profile_picture: Joi.string().required(),
      google_user_id: Joi.string().required(),
      center: Joi.string(),
      github_link: Joi.string(),
      linkedin_link: Joi.string(),
      medium_link: Joi.string(),
    });
  }

  // $beforeInsert() {
  //   const now = new Date();
  //   this.createdAt = now;
  // }
};
