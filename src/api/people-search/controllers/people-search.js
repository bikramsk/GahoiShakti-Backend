'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::people-search.people-search', ({ strapi }) => ({
  async search(ctx) {
    try {
      const {
        name,
        gender,
        ageMin,
        ageMax,
        maritalStatus,
        page = 1,
        pageSize = 12
      } = ctx.query;

     
      const where = {};
      const populate = {
        personal_information: {
          populate: ['display_picture']
        },
        additional_details: {
          populate: ['regional_information']
        },
        family_details: true,
        biographical_details: true
      };

      // Apply filters using correct component field syntax
      if (name) {
        where.personal_information = {
          full_name: { $containsi: name }
        };
      }

      if (gender) {
        where.personal_information = {
          ...where.personal_information,
          Gender: { $eq: gender }
        };
      }

      if (maritalStatus) {
        where.biographical_details = {
          ...where.biographical_details,
          is_married: { $eq: maritalStatus }
        };
      }





      // Use entity service instead of direct 
      const results = await strapi.entityService.findMany('api::registration-page.registration-page', {
        filters: where,
        populate: populate,
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize)
        },
        sort: { createdAt: 'desc' }
      });



      // Filter by age if specified (since age is calculated from date_of_birth)
      let filteredResults = Array.isArray(results) ? results : [];
      if (ageMin || ageMax) {
        const minAge = ageMin ? parseInt(ageMin) : 0;
        const maxAge = ageMax ? parseInt(ageMax) : 150;

        filteredResults = filteredResults.filter(person => {
          const dateOfBirth = person.additional_details?.date_of_birth;
          if (!dateOfBirth) return false;

          const today = new Date();
          const birthDate = new Date(dateOfBirth);
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }

          return age >= minAge && age <= maxAge;
        });
      }



      // Return results
      return {
        data: filteredResults,
        meta: {
          pagination: {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            pageCount: Math.ceil(filteredResults.length / parseInt(pageSize)),
            total: filteredResults.length
          }
        }
      };

    } catch (error) {
      console.error('Search error:', error);
      return ctx.internalServerError('Search failed', {
        error: error.message
      });
    }
  }
}));
