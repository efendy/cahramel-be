'use strict';

/**
 * user-contract service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::user-contract.user-contract');
