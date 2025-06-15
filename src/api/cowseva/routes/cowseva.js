'use strict';

/**
 * cowseva router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::cowseva.cowseva');
