module.exports = async function (req, res) {

    //check already logged in
    // if(!!JWTHelpers.hasToken(req)) {
    //     return res.forbidden();
    // }

    if (!request.validate(req, res, {
        'email': 'required|email',
        'password': 'required'
    })) return;

    let email = req.param('email');

    let userRecord = await User.withMeta({
        email: email.toLowerCase()
    });

    if (!userRecord) {
        return res.json({message: 'email or password does not match'}).status(404);
    }

    try {
        await sails.helpers.passwords.checkPassword(req.param('password'), userRecord.password);
    } catch (e) {
        return res.json({message: 'email or password does not match'}).status(404);
    }

    delete userRecord.password;

    let appSecret = sails.config.custom.appSecret;
    let jwtTime = sails.config.custom.jwtTime;
    let jwtRefreshTime = sails.config.custom.jwtRefreshTime;
    let userWithoutMeta = _.cloneDeep(userRecord); // get userWithUserMeta data copy

    delete userWithoutMeta.meta; //remove meta from userWithUserMeta

    let bearerToken = await sails.JWT.sign({
        data: userWithoutMeta // assign only user data
    }, appSecret, {expiresIn: jwtTime});

    let refreshToken = await sails.JWT.sign({
        data: {bearerToken: bearerToken, user: userWithoutMeta}
    }, appSecret, {expiresIn: jwtRefreshTime / 1000});

    res.cookie('refreshToken', refreshToken, { maxAge: jwtRefreshTime, httpOnly: true, signed:true });

    return res.json({
        user: userRecord, // send userWithUserMeta
        bearerToken: bearerToken,
    }).status(200);
};


