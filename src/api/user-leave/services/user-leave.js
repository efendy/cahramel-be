'use strict';

/**
 * user-leave service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::user-leave.user-leave');
