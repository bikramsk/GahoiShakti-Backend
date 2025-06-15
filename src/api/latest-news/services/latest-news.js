'use strict';

/**
 * latest-news service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::latest-news.latest-news');
