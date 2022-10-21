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
