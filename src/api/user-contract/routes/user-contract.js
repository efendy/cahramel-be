'use strict';

/**
 * user-contract router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::user-contract.user-contract');
