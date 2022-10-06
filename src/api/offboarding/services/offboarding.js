'use strict';

/**
 * offboarding service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::offboarding.offboarding');
