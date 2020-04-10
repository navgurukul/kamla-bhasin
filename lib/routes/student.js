const Joi = require('joi');

const Students = require('../models/students');

const internals = {};

internals.studentSchema = Joi.object({
  name: Students.field('name'),
  email: Students.field('email'),
  profilePicture: Students.field('profilePicture'),
  googleUserId: Students.field('googleUserId'),
  center: Students.field('center'),
  githubLink: Students.field('githubLink'),
  linkedinLink: Students.field('linkedinLink'), 
  mediumLink: Students.field('mediumLink')
});

module.exports = [
  {
    method: 'GET',
    path: '/students',
    options: {
      description: 'Get the list of all the students.',
      tags: ['api'],
      handler: async (request) => {
        const { studentService } = request.services();

        const students = await studentService.findAll();

        return { data: students };
      },
    },
  },
  {
    method: 'POST',
    path: '/students',
    options: {
      description: 'Create a new student.',
      tags: ['api'],
      validate: {
        payload: internals.studentSchema
      },
      handler: async (request) => {
        const { studentService } = request.services();
        
        const student = await studentService.create(request.payload);
        return { data: student };
      }
    }
  },
  {
    method: 'POST',
    path: '/students/login/google',
    options: {
      description: 'Login with googel account.',
      tags: ['api'],
      validate: {
        payload: {
          idToken: Joi.string().required(),
        },
      },
      handler: async (request) => {
        const { studentService } = request.services();
        const user = await studentService.googleLogin(request.payload.idToken);
        const userToken = await studentService.createToken(user);
          return {
            user,
            userToken,
          };
      },
    },
  }
];
