const Joi = require('joi');
const { Readable } = require('stream');
const Helpers = require('../helpers');

const Students_details = require('../models/user_details');

const internals = {};

internals.k_details_Schema = Joi.object({
  name: Students_details.field('name'),
  parents_name: Students_details.field('parents_name'),
  address: Students_details.field('address'),
  city: Students_details.field('city'),
  state: Students_details.field('state'),
  pin_code: Students_details.field('pin_code')
});

module.exports = [
  {
    method: 'GET',
    path: '/students/details',
    options: {
      description: 'Get the list of all the users details.',
      tags: ['api'],
      handler: async (request) => {
        const { kDetailsService } = request.services();
        const students_inof = await kDetailsService.findAll();
        return { data: students_inof };
      },
    },
  },
  {
    method: 'POST',
    path: '/students/details',
    options: {
      description: 'Create a new user details.',
      tags: ['api'],
      validate: {
        payload: internals.k_details_Schema
      },
      handler: async (request) => {
        const { kDetailsService } = request.services();
        const students_inof = await kDetailsService.create(request.payload);
        return { data: students_inof };
      }
    }
  },
  {
    method: 'PUT',
    path: '/students/details/{userId}',
    options: {
      description: 'Update user details with the given ID.',
      tags: ['api'],
      validate: {
        params: {
          userId: Joi.number().integer(),
        },
        payload: internals.k_details_Schema,
      },
      handler: async (request) => {
        const { kDetailsService } = request.services();
        const user = await kDetailsService.findById(request.params.userId);
        await kDetailsService.userUpdate(request.params.userId, request.payload);
        return { data: user };  
      },
    },
  },
  {
    method: 'GET',
    path: '/students/details/{userId}',
    options: {
      description: 'Get user details given by userId.',
      tags: ['api'],
      validate: {
        params: {
          userId: Joi.number().integer(),
        },
      },

      handler: async (request) => {
        const { kDetailsService } = request.services();
        const user = await kDetailsService.findById(request.params.userId);
        return { data: user };
      },
    },
  },
  {
    method: 'POST',
    path: '/students/details/upload_file/{uploadType}',
    options: {
      description: 'Upload file to S3. Upload type like CSV, PDF or images need to be specified.',
      payload: {
        output: 'stream',
        parse: true,
        maxBytes: 2 * 10000 * 10000,
        allow: 'multipart/form-data',
      },
      tags: ['api'],
      validate: {
        params: {
          uploadType: Joi.string().valid('IMG', 'CSV', 'PDF'),
        },
        payload: {
          file: Joi.object().type(Readable).required().meta({ swaggerType: 'file' }),
        },
      },
      plugins: {
        'hapi-swagger': { payloadType: 'form' },
      },
      handler: async (request) => {
        const fileS3URL = await Helpers.uploadToS3(request.payload.file, request.params.uploadType);
        return { fileUrl: fileS3URL };
      },
    },
  },
];