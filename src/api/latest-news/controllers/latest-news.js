'use strict';

/**
 * latest-news controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::latest-news.latest-news');
