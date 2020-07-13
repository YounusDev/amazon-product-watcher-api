/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

    /***************************************************************************
     *                                                                          *
     * Default policy for all controllers and actions, unless overridden.       *
     * (`true` allows public access)                                            *
     *                                                                          *
     ***************************************************************************/

    '*': 'is-logged-in',
    'defaults/thanks': true,
    'auth/login': true,
    'auth/register': true,
    'auth/refresh': true,
    'password/forgot-password': true,
    'password/reset-password': true,
    'auth/resend-verify-email': true,
    'auth/account-verification': true,
};
