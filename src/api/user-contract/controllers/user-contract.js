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
        const userProfile = await strapi.db.query("api::user-profile.user-profile").findOne({
          select: ['id', 'first_name', 'last_name', 'email_address', 'phone_number'],
          where: { id: userContract.user_profile.id },
          populate: {
            users: {
              select: ['id', 'email'],
            },
          },
        });

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

      if (byemail) {

      } else {
        if (code) {
          const entity = await strapi.db.query("api::user-contract.user-contract").findOne({
            select: ['id'],
            where: { code },
            populate: {
              user_profile: {
                select: ['id', 'email_address'],
              },
            },
          });

          // if 
        }
      }
    }
    if (ctx.params.code) {
      const entity = await strapi.db.query("api::user-contract.user-contract").findOne({
        select: ['id'],
        where: { code: ctx.params.code },
        populate: {
          user_profile: {
            select: ['id', 'first_name', 'last_name', 'email_address', 'phone_number'],
          },
          user: {
            select: ['id'],
          },
        },
      });

      const sanitizedEntity = await this.sanitizeOutput(entity);
      response = this.transformResponse(entity);
    }

    return response;
  },

}));
