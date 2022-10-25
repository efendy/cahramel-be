'use strict';

/**
 * user-contract controller
 */
 const utils = require('@strapi/utils');
 const { NotFoundError, ForbiddenError } = utils.errors;

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::user-contract.user-contract', ({ strapi }) => ({

  async draftSave(ctx) {
    let response;

    const userId = ctx.state?.user?.id;
    console.log(userId);

    if (userId && ctx.request.body?.data) {
      const { id, profile, contract } = ctx.request.body.data;
      
      if (profile && contract) {
        // retrieve authenticated user profile for getting user contract
        const authUserProfile = await strapi.db.query("api::user-profile.user-profile").findOne({
          select: ['id'],
          where: { users: userId },
        });

        // retrieve authenticated user contract for access_role and company ids
        // to ensure the authenticated user has the permission to set
        const authUserContracts = await strapi.db.query("api::user-contract.user-contract").findMany({
          select: ['id', 'access_role'],
          where: { user_profile: authUserProfile.id },
          populate: {
            company_profile: {
              select: ['id']
            }
          },
        });

        // an admin doesn't allow to add user to other company
        const authUserCompanyIds = authUserContracts.map(object => object.company_profile.id);
        if (!authUserCompanyIds.includes(contract.company_id)) {
          console.log(`auth user does not contract with the company id ${contract.company_id}.`);
          throw new ForbiddenError('You didn\'t say the magic word');
        }

        // an admin doesn't allow to set access_role owner for other user.
        // const authUser
        if (contract.access_role === 'owner' && authUserContracts.access_role === 'owner') {
          throw new ForbiddenError('You didn\'t say the magic word');
        }
        if (authUserContracts.access_role === 'admin' && contract.access_role === 'owner') {
          throw new ForbiddenError('You didn\'t say the magic word');
        }

        throw new ForbiddenError('You didn\'t say the magic word');

        let userContract;
        if (id) {
          userContract = await strapi.db.query("api::user-contract.user-contract").findOne({
            select: ['id'],
            where: { id },
          });
        }

        // retrieve existing user-profile by email
        const userProfile = await strapi.db.query("api::user-profile.user-profile").findOne({
          select: ['id', 'first_name', 'last_name', 'email_address', 'phone_number'],
          where: { email_address: profile.email },
        });

        if (userProfile) {

        }
      }
    }

    if (!response)  {
      throw new NotFoundError('Does not exist');
    }
    return response;
  },

  async draftDelete(ctx) {
    let response;

    if (!response)  {
      throw new NotFoundError('Does not exist');
    }
    return response;
  },

  async draftConfirm(ctx) {
    let response;

    if (!response)  {
      throw new NotFoundError('Does not exist');
    }
    return response;
  },

  async inviteCheck(ctx) {
    let response;

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

    if (!response)  {
      throw new NotFoundError('Does not exist');
    }
    return response;
  },

  async linkUser(ctx) {
    let response;

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
    
    if (!response)  {
      throw new NotFoundError('Does not exist');
    }
    return response;
  },

}));
