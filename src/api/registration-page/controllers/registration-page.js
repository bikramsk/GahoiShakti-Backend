'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::registration-page.registration-page', ({ strapi }) => ({
  async create(ctx) {
    try {
      const mobileNumber = ctx.request.body.data?.personal_information?.mobile_number;
      
      if (!mobileNumber) {
        return await super.create(ctx);
      }

      const existingRegistration = await strapi.db.query('api::registration-page.registration-page').findOne({
        where: {
          personal_information: {
            mobile_number: mobileNumber
          }
        },
        populate: ['personal_information']
      });

      if (existingRegistration) {
        
        const updated = await strapi.db.query('api::registration-page.registration-page').update({
          where: { id: existingRegistration.id },
          data: ctx.request.body.data,
          populate: ['personal_information']
        });
        return { data: updated };
      }

     
      const response = await super.create(ctx);
      return response;

    } catch (error) {
      console.error('Registration error:', error);
      
     
      if (error.code === '23505' || error.message.includes('unique')) {
        return ctx.conflict('A registration with this mobile number already exists');
      }

     
      console.error('Detailed error:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        details: error.details
      });
      
      return ctx.badRequest('Registration failed', { error: error.message });
    }
  }
}));



