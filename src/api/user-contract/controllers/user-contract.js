'use strict';

/**
 * user-contract controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::user-contract.user-contract', ({ strapi }) => ({

  async draftSave(ctx) {
    let response = {
      data: null,
      error: {
        status: 400,
        name: "Bad Request",
        message: "Invalid Request"
      }
    };

    return response;
  },

  async draftDelete(ctx) {
    let response = {
      data: null,
      error: {
        status: 400,
        name: "Bad Request",
        message: "Invalid Request"
      }
    };

    return response;
  },

  async draftConfirm(ctx) {
    let response = {
      data: null,
      error: {
        status: 400,
        name: "Bad Request",
        message: "Invalid Request"
      }
    };

    return response;
  },

  async inviteCheck(ctx) {
    let response = {
      data: null,
      error: {
        status: 400,
        name: "Bad Request",
        message: "Invalid Request"
      }
    };

    if (ctx.params.code) {
      // retrieve user contract using invitation code to get the user profile id
      const userContract = await strapi.db.query("api::user-contract.user-contract").findOne({
        select: ['id'],
        where: { code: ctx.params.code },
        populate: {
          user_profile: {
            select: ['id'],
          },
        },
      });

      if (userContract?.user_profile?.id) {
        // retrieve users from user profile
        let userProfile = await strapi.db.query("api::user-profile.user-profile").findOne({
          select: ['id', 'first_name', 'last_name', 'email_address', 'phone_number'],
          where: { id: userContract.user_profile.id },
          populate: {
            users: {
              select: ['id', 'email'],
            },
          },
        });
        userProfile.user_contract_id = userContract.id;
        response = this.transformResponse(userProfile);
      }
    }

    return response;
  },

  async linkUser(ctx) {
    let response = {
      data: null,
      error: {
        status: 400,
        name: "Bad Request",
        message: "Invalid Request"
      }
    };

    const userId = ctx.state?.user?.id;

    if (userId && ctx.request.body?.data) {
      const { code, byemail } = ctx.request.body.data;
      let userContract;

      if (byemail) {
        // get email from user
        const user = await strapi.db.query("plugin::users-permissions.user").findOne({
          select: ['email'],
          where: { id: userId },
        });
        
        if (user.email) {
          // retrieve user contract by email to get user profile id
          userContract = await strapi.db.query("api::user-contract.user-contract").findOne({
            select: ['id'],
            where: { email_address: user.email },
            populate: {
              user_profile: {
                select: ['id'],
              },
            },
          });
        }
      } else {
        if (code) {
          // retrieve user contract using invitation code to get the user profile id
          userContract = await strapi.db.query("api::user-contract.user-contract").findOne({
            select: ['id'],
            where: { code },
            populate: {
              user_profile: {
                select: ['id'],
              },
            },
          });
        }
      }

      const userProfileId = userContract?.user_profile?.id;
      if (userProfileId) {
        // get existing users in user profile
        const userProfile = await strapi.db.query("api::user-profile.user-profile").findOne({
          select: ['id'],
          where: { id: userProfileId },
          populate: {
            users: {
              select: ['id'],
            },
          }
        });

        if (userProfile) {
          const userIds = userProfile.users.map(object => object.id);
          // link user to user profile
          let updateUserProfile = await strapi.db.query("api::user-profile.user-profile").update({
            select: ['id'],
            where: { id: userProfileId },
            data: {
              users: [...userIds, userId],
            }
          });
          if (updateUserProfile) {
            // remove invitation code
            await strapi.db.query("api::user-contract.user-contract").update({
              where: { id: userContract.id },
              data: {
                code: null,
              }
            });
          }

          updateUserProfile.user_contract_id = userContract.id;
          response = this.transformResponse(updateUserProfile);
        }
      }
    }
    return response;
  },

}));
