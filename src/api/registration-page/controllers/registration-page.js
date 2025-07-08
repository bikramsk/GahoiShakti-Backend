'use strict';

/**
 * registration-page controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::registration-page.registration-page', ({ strapi }) => ({
  async create(ctx) {
    // Call the default create logic
    const response = await super.create(ctx);

    // Get the mobile number from the request body
    const mobileNumber = ctx.request.body.data?.personal_information?.mobile_number;

    if (mobileNumber) {
      // Set isRegistered: true for this user
      await strapi.query('api::mobile-user.mobile-user').update({
        where: { mobileNumber },
        data: { isRegistered: true }
      });
    }

    return response;
  }
}));