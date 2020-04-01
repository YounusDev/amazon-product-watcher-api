module.exports = async function (req, res) {

    //check already logged in
    if(!!JWTHelpers.hasToken(req)) {
        return res.forbidden();
    }

    if (!request.validate(req, res, {
        'email': 'required|email',
        'first_name': 'required',
        'last_name': 'required',
        'password': 'required|confirmed'
    })) return;

    let email = req.param('email');
    let firstName = req.param('first_name');
    let lastName = req.param('last_name');
    let password = req.param('password');

    let checkUser = await User.findOne({
        email: email.toLowerCase()
    });

    if (checkUser) {
        return res.status(422).json({
            errors:
                {'email': 'this email already used'}
        });
    }

    let createdUser = await User.create({
        email: email,
        password: await sails.helpers.passwords.hashPassword(password),
        validated: true
    }).fetch();

    let userMeta = await UserMeta.create({
        userId: createdUser.id,
        firstName: firstName,
        lastName: lastName
    }).fetch();

    delete createdUser.password;

    let appSecret = sails.config.custom.appSecret;
    let jwtTime = sails.config.custom.jwtTime;
    let jwtRefreshTime = sails.config.custom.jwtRefreshTime;

    let bearerToken = await sails.JWT.sign({
        data: createdUser
    }, appSecret, {expiresIn: jwtTime});

    let refreshToken = await sails.JWT.sign({
        data: {bearerToken: bearerToken, user: createdUser}
    }, appSecret, {expiresIn: jwtRefreshTime / 1000});

    res.cookie('refreshToken', refreshToken, { maxAge: jwtRefreshTime, httpOnly: true, signed:true });

    createdUser.meta = userMeta;

    return res.status(200).json({
        user: createdUser,
        bearerToken: bearerToken,
    });
};
