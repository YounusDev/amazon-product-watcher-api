/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */

module.exports.custom = {

    /***************************************************************************
     *                                                                          *
     * Any other custom config this Sails app should use during development.    *
     *                                                                          *
     ***************************************************************************/
    // mailgunDomain: 'transactional-mail.example.com',
    // mailgunSecret: 'key-testkeyb183848139913858e8abd9a3',
    // stripeSecret: 'sk_test_Zzd814nldl91104qor5911gjald',
    // …

    appSecret: '5a632519-4d50-496f-9e7d-cef656716099',
    jwtTime: 2*60, // 5 min
    //jwtRefreshTime: 72*60*60*1000 // 3 day
    jwtRefreshTime: 30*1000 // 3 day
};
