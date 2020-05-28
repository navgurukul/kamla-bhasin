const Joi = require('joi');
const Students = require('../models/students');
const internals = {};


internals.studentSchema = Joi.object({
  name: Students.field('name'),
  email: Students.field('email'),
  profile_picture: Students.field('profile_picture'),
  google_user_id: Students.field('google_user_id'),
  center: Students.field('center'),
  github_link: Students.field('github_link'),
  linkedin_link: Students.field('linkedin_link'),
  medium_link: Students.field('medium_link'),
});

module.exports = [
  {
    method: 'GET',
    path: '/students',
    options: {
      auth: {
        strategy: 'jwt',
      },
      description: 'Get the list of all the students data but only admin can access all data normal users can access their data only.',
      tags: ['api'],
      handler: async (request) => {
        const { email } = request.auth.credentials;
        const { studentService } = request.services();
        const VerifyRole = await studentService.verifyRole(email);
        if (VerifyRole === "SuperAdmin" || VerifyRole === "Admin") {
          const students_inof = await studentService.findAll();
          return { data: students_inof }
        }
        else if (VerifyRole === "Student") {
          const user = await studentService.findByEmail(email)
          return { data: user }
        }

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
        const { studentService, kDetailsService } = request.services();
        const user = await studentService.googleLogin(request.payload.idToken);
        const VerifyRole = await kDetailsService.verifyRole(user.email);
        const userToken = await studentService.createToken(user);
        user["UserRole"]=VerifyRole
        return {
          user,
          userToken,
        };
      },
    },
  }


];
