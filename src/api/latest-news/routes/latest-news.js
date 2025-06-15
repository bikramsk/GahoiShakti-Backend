'use strict';

/**
 * latest-news router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::latest-news.latest-news');
