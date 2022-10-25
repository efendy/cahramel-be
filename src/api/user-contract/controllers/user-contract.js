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

  async linkUser(ctx) {
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

}));
