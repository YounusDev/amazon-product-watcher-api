/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

    'GET /'               : 'defaults/thanks',
    'POST /login'         : 'auth/login',
    'GET /refresh'        : 'auth/refresh',
    'POST /register'      : 'auth/register',
    'POST /update-profile': 'profile/update-profile',
    'GET /me'             : 'auth/me',

    'POST /projects'     : 'domain/store',
    'GET /projects'      : 'domain/index',
    'PATCH /projects/:id': 'domain/update',

    'GET /projects/:id/amazon-products': 'amazon_product/product', // users_domains id
};
