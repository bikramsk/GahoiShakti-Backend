'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::draft-registration.draft-registration', ({ strapi }) => ({
    // Get draft by mobile number
    async findByMobile(ctx) {
        try {
            const { mobileNumber } = ctx.params;
            
            const draft = await strapi.db.query('api::draft-registration.draft-registration').findOne({
                where: { mobileNumber }
            });

            if (!draft) {
                return ctx.notFound('No draft found for this mobile number');
            }

            // Check if draft is older than 24 hours
            const now = new Date();
            const lastSaved = new Date(draft.lastSaved);
            const hoursDiff = (now - lastSaved) / (1000 * 60 * 60);

            if (hoursDiff > 24) {
                // Delete old draft
                await strapi.db.query('api::draft-registration.draft-registration').delete({
                    where: { id: draft.id }
                });
                return ctx.notFound('Draft expired');
            }

            return draft;
        } catch (error) {
            return ctx.badRequest('Error retrieving draft registration');
        }
    },

    // Save or update draft
    async saveOrUpdate(ctx) {
        try {
            const { mobileNumber } = ctx.params;
            const { formData, currentStep } = ctx.request.body;

            const existingDraft = await strapi.db.query('api::draft-registration.draft-registration').findOne({
                where: { mobileNumber }
            });

            const data = {
                mobileNumber,
                formData,
                currentStep,
                lastSaved: new Date()
            };

            if (existingDraft) {
                // Update existing draft
                const updated = await strapi.db.query('api::draft-registration.draft-registration').update({
                    where: { id: existingDraft.id },
                    data
                });
                return updated;
            } else {
                // Create new draft
                const created = await strapi.db.query('api::draft-registration.draft-registration').create({
                    data
                });
                return created;
            }
        } catch (error) {
            return ctx.badRequest('Error saving draft registration');
        }
    },

    // Delete draft
    async deleteDraft(ctx) {
        try {
            const { mobileNumber } = ctx.params;
            
            const deleted = await strapi.db.query('api::draft-registration.draft-registration').delete({
                where: { mobileNumber }
            });

            if (!deleted) {
                return ctx.notFound('No draft found to delete');
            }

            return { message: 'Draft deleted successfully' };
        } catch (error) {
            return ctx.badRequest('Error deleting draft registration');
        }
    }
})); 