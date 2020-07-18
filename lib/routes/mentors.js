
const Joi = require('joi');
const Mentors = require('../models/mentors');
const internals = {};

internals.mentors_schema = Joi.object({
  user_id: Mentors.field('user_id'),
  scope: Mentors.field('scope')
});

module.exports = [
  {
    method: 'GET',
    path: '/mentors/details',
    options: {
      auth: {
        strategy: 'jwt',
      },
      description: 'Get all data from mentors table',
      tags: ['api'],
      handler: async (request) => {
        const { id,email } = request.auth.credentials;
        const { mentorsService } = request.services();
        const VerifyRole = await mentorsService.verifyRole(email);
        if (VerifyRole) {
          const mentors_data = await mentorsService.findAll();
        return { data: mentors_data }
        }
        const mentors_data = await mentorsService.findOneWithUser(id);
        return { data: mentors_data }

      },
    },
  },

  {
    method: 'POST',
    path: '/mentors/details',
    options: {
      auth: {
        strategy: 'jwt',
      },
      description: 'Create and update mentors details but SuperAdmin, Admin and Tnp can create and update any users information.',
      tags: ['api'],
      validate: {
        payload: internals.mentors_schema
      },
      handler: async (request) => {
        const { id, email } = request.auth.credentials;
        const { mentorsService } = request.services();
        const VerifyRole = await mentorsService.verifyRole(email);

        if (VerifyRole) {
          const mentors_info = await mentorsService.findOneWithUser(request.payload.user_id);
          if (mentors_info.length === 0) {
            const mentors_data = await mentorsService.create(request.payload);
            return {
              data: mentors_data
            };
          } else {
            const mentors_data = await mentorsService.mentorsInfoUpdate(request.payload.user_id, request.payload);
            return { data: mentors_data }
          }
        } else {
          request.payload['user_id'] = id;
          const mentors_info = await mentorsService.findOneWithUser(id);
          if (mentors_info.length === 0) {
            const mentors_data = await mentorsService.create(request.payload);
            return {
              data: mentors_data
            };
          } else {
            const mentors_data = await mentorsService.mentorsInfoUpdate(id, request.payload);
            return { data: mentors_data }
          }
        }
      }
    }
  },
  {
    method: "DELETE",
    path: "/mentors/details",
    options: {
      auth: {
        strategy: 'jwt',
      },
      description: 'Delete mentors user details but SuperAdmin, Admin and Tnp can delete any users mentors data',
      tags: ['api'],
      validate: {
        payload: {
          user_id: Mentors.field("user_id")
        }
      },
      handler: async (request) => {
        const { id, email } = request.auth.credentials;
        const { mentorsService } = request.services();
        const VerifyRole = await mentorsService.verifyRole(email);
        if (VerifyRole) {
          const mentors_data = await mentorsService.deleteMentorsData(request.payload.user_id);
          return { data: mentors_data };
        } else {          
          const mentors_data = await mentorsService.deleteMentorsData(id);
          return { data: mentors_data };
        }
      }
    }
  }
];
