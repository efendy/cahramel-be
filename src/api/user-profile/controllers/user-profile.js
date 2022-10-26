'use strict';

/**
 * user-profile controller
 */

// const utils = require('@strapi/utils');
// const { NotFoundError } = utils.errors;

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
      ctx.request.url = `${currentURL}${hasParam ? '&' : '?'}filters[users]=${userId}`;

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

  async linkUser(ctx) {
    let response = {
      data: { message: "done" },
    };

    if (ctx.request.body?.data) {
      const { user_id, email, code } = ctx.request.body.data;

      if (user_id && email && code) {
        console.log(user_id, email, code);
        const userId = user_id;

        // get email from user
        const user = await strapi.db.query("plugin::users-permissions.user").findOne({
          select: ['email'],
          where: { id: userId },
        });
        
        // user email must matches the payload email
        if (user?.email === email) {
          console.log('user?.email === email? YES');
          // retrieve user contract by code to get user profile id
          const userContract = await strapi.db.query("api::user-contract.user-contract").findOne({
            select: ['id'],
            where: { code: code, is_draft: false },
            populate: {
              user_profile: {
                select: ['id'],
              },
            },
          });
          const userProfileId = userContract?.user_profile?.id;

          console.log('userProfileId', userProfileId);
          if (userProfileId) {
            // get existing users in user profile
            const userProfile = await strapi.db.query("api::user-profile.user-profile").findOne({
              select: ['id', 'email_address'],
              where: { id: userProfileId },
              populate: {
                users: {
                  select: ['id'],
                },
              }
            });

            // user profile email must matches the payload email
            if (userProfile?.email_address === email) {
              console.log('userProfile?.email_address === email? YES');
              const userIds = userProfile.users.map(object => object.id);
              // link user to user profile
              let updateUserProfile = await strapi.db.query("api::user-profile.user-profile").update({
                select: ['id'],
                where: { id: userProfileId },
                data: {
                  users: [...userIds, userId],
                }
              });
              console.log('updateUserProfile', updateUserProfile);
              if (updateUserProfile) {
                // remove invitation code
                await strapi.db.query("api::user-contract.user-contract").update({
                  where: { id: userContract.id },
                  data: {
                    code: null,
                  }
                });
              }
            }
          }
        }
      }
    }
    return response;
  },
}));
