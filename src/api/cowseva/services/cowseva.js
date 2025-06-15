'use strict';

/**
 * cowseva service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::cowseva.cowseva');
