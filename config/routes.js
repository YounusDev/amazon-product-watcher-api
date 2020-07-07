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
    'POST /login': 'auth/login',
    'GET /refresh': 'auth/refresh',

    'GET /me': 'auth/me',
    'PATCH /update-profile': 'profile/update-profile',

    'POST /check-password': 'password/check-password',
    'PATCH /change-password': 'password/change-password',
    'POST /forgot-password': 'password/forgot-password',
    'PATCH /reset-password/:token': 'password/reset-password',

    'GET /projects': 'project/index',
    'GET /projects/:id': 'project/show',
    'POST /projects': 'project/store',
    'PATCH /projects/:id': 'project/update',

    'GET /projects/:id/amazon-products': 'amazon_product/products', // userdomain id
    'PATCH /projects/:id/amazon-products': 'amazon_product/update',

    'GET /amazon-products/:id': 'amazon_product/product-in-pages', // amazonproduct id

    'POST /broken-links/:project_id': 'broken_link/index', // domain id
    'PATCH /projects/:id/broken-links': 'broken_link/update',

    'GET /projects/:id/guest-posts': 'guest_post/index', // domain id
    'PATCH /projects/:id/guest-posts': 'guest_post/update',

    'GET /projects/:id/pages-speed': 'page_speed/index',
    'PATCH /projects/:id/pages-speed': 'page_speed/update',

    'GET /projects/:id/domain-uptime': 'domain_uptime/show',
    'GET /projects/:id/domain-uptime-logs': 'domain_uptime/uptime-logs',
    'GET /projects/:id/domain-uptime-timeline': 'domain_uptime/uptime-timeline',
    'GET /projects/:id/domain-uptime-latest-downtime': 'domain_uptime/uptime-latest-downtime',
    'PATCH /projects/:id/domain-uptime': 'domain_uptime/update',

    'GET /notifications': 'notification/index',

    'GET /latest-issues': 'notification/latest-issues',
    'GET /latest-scraped-pages': 'notification/latest-scraped-pages',
    'GET /latest-parsed-pages': 'notification/latest-parsed-pages',
    'GET /latest-scraped-products': 'notification/latest-scraped-products',
    'GET /latest-parsed-products': 'notification/latest-parsed-products',

    'GET /projects-count': 'count/project',
    'GET /pages-count': 'count/page',
    'GET /products-count': 'count/product',
};
