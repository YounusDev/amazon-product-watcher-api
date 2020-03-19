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

    'GET /': 'defaults/thanks',
    'POST /login': 'auth/login',
    'GET /token/refresh': 'auth/refresh',
    'POST /register': 'auth/register',
    'POST /update-profile': 'profile/update-profile',

    'POST /domain/create': 'domain/store',
    'POST /domain/index': 'domain/index',
    'POST /domain/update': 'domain/update',


};
