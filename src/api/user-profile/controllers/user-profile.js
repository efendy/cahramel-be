'use strict';

/**
 * user-profile controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::user-profile.user-profile', ({ strapi }) => ({
  async findOne(ctx) {
    let response = null;
    if (ctx.params.id == "me" && ctx.state?.user?.id) {
      console.log(ctx.state?.user?.id)
      const userId = ctx.state?.user?.id;

      delete ctx.params.id;

      ctx.request.url = `/api/user-profiles?filters[users]=${userId}`;

      const result = await super.find(ctx);
      if (result.data?.length > 0) {
        response = result.data[0];
      }
    } else {
      response = await super.findOne(ctx);
    }
    return response;
  },
}));
