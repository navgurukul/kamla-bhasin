const Joi = require('joi');
const { Readable } = require('stream');
const Helpers = require('../helpers');
const Students_details = require('../models/user_details')


const internals = {};
internals.k_details_Schema = Joi.object({
  email: Students_details.field('email'),
  name: Students_details.field('name'),
  parents_name: Students_details.field('parents_name'),
  address: Students_details.field('address'),
  city: Students_details.field('city'),
  state: Students_details.field('state'),
  pin_code: Students_details.field('pin_code'),
  profile_pic:Students_details.field('profile_pic'),
  indemnity_form:Students_details.field('indemnity_form')
});

module.exports = [
  {
    method: 'GET',
    path: '/students/details',
    options: {
      auth: {
        strategy: 'jwt',
      },
      description: 'Get the list of all the users details by SuperAdmin or Admin and other can access their data.',
      tags: ['api'],
      handler: async (request) => {
        const { email } = request.auth.credentials;
        const { kDetailsService } = request.services();
        const VerifyRole = await kDetailsService.verifyRole(email);
        if (VerifyRole === "SuperAdmin" || VerifyRole === "Admin") {
          const students_inof = await kDetailsService.findAll();
          return { data: students_inof }

        } else if (VerifyRole === "Student") {
          const user = await kDetailsService.findByEmail(email)
          return { data: user }
        }
      },
    },
  },

  {
    method: 'POST',
    path: '/students/details',
    options: {
      auth: {
        strategy: 'jwt',
      },
      description: 'Create and update an user details but in this normal user can create and update his data only.',
      tags: ['api'],
      validate: {
        payload: internals.k_details_Schema
      },
      handler: async (request) => {
        const { email } = request.auth.credentials;
        const { kDetailsService } = request.services();
        const VerifyRole = await kDetailsService.verifyRole(email);
        if (VerifyRole === "SuperAdmin" || VerifyRole === "Admin") {
          const payload_email = request.payload["email"]
          const students_inof = await kDetailsService.findByEmail(payload_email)
          if (students_inof.length === 0) {
            const students_inof = await kDetailsService.create(request.payload);
            return {
              data: students_inof
            }
          } else {
            await kDetailsService.userUpdate(payload_email, request.payload);
            const students_inof = await kDetailsService.findByEmail(payload_email)
            return { data: students_inof };
          }
        }else{ 
          request.payload['email'] = email 
            const students_inof = await kDetailsService.findByEmail(email)
            if (students_inof.length === 0) {
              const students_inof = await kDetailsService.create(request.payload)
              return {
                data: students_inof
              }
            } else {
              await kDetailsService.userUpdate(email, request.payload);
              const students_inof = await kDetailsService.findByEmail(email)
              return { data: students_inof };
            }
        }
      }
    }
  },

  {
    method: 'POST',
    path: '/students/details/upload_file/{uploadType}',
    options: {
      description: 'Upload file to S3. Upload type like IMG, PDF or images need to be specified.',
      payload: {
        output: 'stream',
        parse: true,
        maxBytes: 7 * 1000 * 1000,
        allow: 'multipart/form-data',
      },
      tags: ['api'],
      validate: {
        params: {
          uploadType: Joi.string().valid('profilePic', 'indemnityForm'),
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