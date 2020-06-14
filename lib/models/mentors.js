const Joi = require('joi');
const { Model } = require('./helpers');

module.exports = class Mentors extends Model {
  static get tableName() {
    return 'mentors';
  }

  static get joiSchema() {
    return Joi.object({
      id: Joi.number().integer().greater(0),
      mentor: Joi.number().integer().greater(0),
      mentee: Joi.number().integer().greater(0),
      scope: Joi.string(),
      user_id: Joi.number().integer().greater(0),
      created_at: Joi.date(),
    });
  }

  $beforeInsert() {
    const now = new Date();
    this.created_at = now;
  }

  static get relationMappings() {
    const users_Schema = require('./students');

    return {
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: users_Schema,
        join: {
          from: 'mentors.user_id',
          to:'users.id'
        }
      }
    }

  }
};