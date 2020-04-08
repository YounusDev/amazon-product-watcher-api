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

    'PATCH /projects/:id/amazon-products': 'amazon_product/update',
    'PATCH /projects/:id/broken-links': 'broken_link/update',
    'PATCH /projects/:id/guest-posts': 'guest_link/update',

    'GET /projects/:id/amazon-products': 'amazon_product/products', // userdomain id
    'POST /amazon-products/:id': 'amazon_product/product-in-pages', // amazonproduct id

    'POST /broken-links/:project_id': 'broken_link/index', // domain id

    'POST /guest-links/:project_id': 'guest_link/index', // domain id
};
