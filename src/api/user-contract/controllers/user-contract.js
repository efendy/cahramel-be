'use strict';

/**
 * user-contract controller
 */

const utils = require('@strapi/utils');
const { NotFoundError, ForbiddenError } = utils.errors;
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::user-contract.user-contract', ({ strapi }) => ({

  async draftSave(ctx) {
    let response;

    const userId = ctx.state?.user?.id;

    if (userId && ctx.request.body?.data) {
      const { id, profile, contract } = ctx.request.body.data;
      
      if (profile && contract) {
        // retrieve authenticated user profile for getting user contract
        const authUserProfile = await strapi.db.query("api::user-profile.user-profile").findOne({
          select: ['id'],
          where: { users: userId },
        });

        // retrieve authenticated user contract for access_role and company ids
        // to ensure the authenticated user has the permission to set.
        const authUserContracts = await strapi.db.query("api::user-contract.user-contract").findMany({
          select: ['id', 'access_role'],
          where: { user_profile: authUserProfile.id },
          populate: {
            company_profile: {
              select: ['id']
            }
          },
        });

        // an authenticated user doesn't allow to create user for different company
        // which the authenticated user doesn't have contract to.
        const authUserCompanyIds = authUserContracts.map(object => object.company_profile.id);
        if (!authUserCompanyIds.includes(contract.company_id)) {
          console.log(`auth user does not contract with the company id ${contract.company_id}.`);
          throw new ForbiddenError('You didn\'t say the magic word');
        }

        // validate setting access_role
        const authUserAccessRole = authUserContracts.find(object => object.company_profile.id === contract.company_id)?.access_role;
        if ((contract.access_role === 'owner' && (authUserAccessRole === 'user' || authUserAccessRole === 'admin')) ||
            authUserAccessRole === 'user') {
          throw new ForbiddenError('You didn\'t say the magic word');
        }

        let userProfileId;
        // check if user profile exists.
        let userProfile = await strapi.db.query("api::user-profile.user-profile").findOne({
          select: ['id', 'first_name', 'last_name', 'email_address', 'phone_number'],
          where: { email_address: profile.email },
        });
        
        if (userProfile) {
          console.log('userProfile', userProfile);
          userProfileId = userProfile.id;
        } else {
          // user-profile CREATION
          const createUserProfile = await strapi.db.query("api::user-profile.user-profile").create({
            select: ['id', 'first_name', 'last_name', 'email_address', 'phone_number'],
            data: {
              first_name: profile.first_name,
              last_name: profile.last_name || "",
              email_address: profile.email,
              country_code: profile.country_code || null,
              phone_number: profile.phone_number || null
            }
          });
          console.log('createUserProfile', createUserProfile);

          userProfile = createUserProfile;
          userProfileId = createUserProfile.id;
        }

        // user-contract creation / update
        let userContractId;
        let userContract;
        // check if user contract exists.
        if (id) {
          userContract = await strapi.db.query("api::user-contract.user-contract").findOne({
            select: ['id'],
            where: { id },
          });
          if (!userContract) {
            throw new NotFoundError('Does not exist');
          }
          userContractId = userContract.id;
        }

        const userContractData = {
          employee_id: contract.employee_id,
          job_title: contract.job_title_id,
          reporting_to_main: contract.reporting_to_main_id,
          reporting_to_secondary: contract.reporting_to_secondary_id,
          department: contract.department_id,
          company_profile: contract.company_id,
          date_start: contract.date_start ? dayjs(contract.date_start).format('YYYY-MM-DD') : null,
          date_end: contract.date_end ? dayjs(contract.date_end).format('YYYY-MM-DD') : null,
          onboarding_status: contract.onboarding_status,
          offboarding_status: contract.offboarding_status,
          email_address: contract.email,
          access_role: contract.access_role,
          user_profile: userProfileId
        };

        if (userContractId) {
          // UPDATE user contract
          const updateUserContract = await strapi.db.query("api::user-contract.user-contract").update({
            where: { id: userContractId },
            data: userContractData
          });

          if (!updateUserContract) {
            throw new NotFoundError('DB Update Contract');
          }

          userContract = updateUserContract;
        } else {
          // CREATE user contract
          const createUserContract = await strapi.db.query("api::user-contract.user-contract").create({
            data: userContractData,
          });

          if (!createUserContract) {
            throw new NotFoundError('DB Create Contract');
          }

          userContract = createUserContract;
        }

        delete userContract.createdAt;
        delete userContract.updatedAt;
        delete userContract.code;

        response = this.transformResponse({
          profile: userProfile,
          contract: userContract,
        });
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
