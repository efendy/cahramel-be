'use strict';

/**
 * user-profile controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::user-profile.user-profile', ({ strapi }) =>  ({
  // async create(ctx) {
  //   let response = {
  //     data: null,
  //     error: {
  //       status: 401,
  //       name: "UnauthorizedError",
  //       message: "Required valid authentication"
  //     }
  //   };

  //   if (ctx.state?.user) {
  //     const { id } = ctx.request.body.data;
  //     const userEntry = await strapi.db.query("plugin::users-permissions.user").findOne({
  //       where: { id },
  //     });
  //     const userMobile = userEntry.external_data.data.find(o => o.providerId === 'phone');
  //     const userEmail = userEntry.external_data.data.find(o => o.providerId === 'email');

  //     if (userMobile) {
  //       console.log(userMobile);
  //       ctx.request.body.data.phone_mobile = userMobile.uid;
  //     }
  //     if (userEmail) {
  //       console.log(userEmail);
  //       ctx.request.body.data.email = userEmail.uid;
  //     }

  //   }
  //   return response;
  // },

}));
