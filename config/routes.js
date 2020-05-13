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
    
    'POST /register': 'auth/register',
    'POST /login'   : 'auth/login',
    'GET /refresh'  : 'auth/refresh',
    
    'GET /me'             : 'auth/me',
    'POST /update-profile': 'profile/update-profile',
    
    'GET /projects'      : 'domain/index',
    'POST /projects'     : 'domain/store',
    'PATCH /projects/:id': 'domain/update',
    
    
    'GET /projects/:id/amazon-products'  : 'amazon_product/products', // userdomain id
    'PATCH /projects/:id/amazon-products': 'amazon_product/update',
    
    'GET /amazon-products/:id': 'amazon_product/product-in-pages', // amazonproduct id
    
    'POST /broken-links/:project_id'  : 'broken_link/index', // domain id
    'PATCH /projects/:id/broken-links': 'broken_link/update',
    
    'GET /projects/:id/guest-posts'  : 'guest_post/index', // domain id
    'PATCH /projects/:id/guest-posts': 'guest_post/update'
};
