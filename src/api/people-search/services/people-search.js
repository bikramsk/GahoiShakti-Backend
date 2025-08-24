'use strict';

/**
 * people-search service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::people-search.people-search');
