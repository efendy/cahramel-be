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
      const userState = ctx.state.user;

      // to return if user is logged in but no user profile
      const defaultUserInfo = {
        id: 0,
        attributes: {
          username: userState?.username,
          email: userState?.email,
          first_name: userState?.first_name,
          last_name: userState?.last_name,
        }
      }

      delete ctx.params.id;
      const currentURL = ctx.request.url.replace('/me', '')
      const hasParam = currentURL.includes('?');
      ctx.request.url = `${currentURL}${hasParam ? '&' : '?'}filters[user]=${userId}`;

      let userProfile = null;
      const result = await super.find(ctx);
      if (result.data?.length > 0) {
        userProfile = result.data[0]
      }
      response = {
        ...defaultUserInfo,
        ...userProfile
      }
    } else {
      response = await super.findOne(ctx);
    }
    return response;
  },
}));
