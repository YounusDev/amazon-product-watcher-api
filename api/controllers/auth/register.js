module.exports = async function (req, res) {

    //check already logged in
    if(!!JWTHelpers.hasToken(req)) {
        return res.forbidden();
    }

    let errors = {};

    let email = req.param('email');
    let firstName = req.param('first_name');
    let lastName = req.param('last_name');
    let password = req.param('password');
    let confirmPassword = req.param('confirm_password');

    if (!email) {
        errors.email = 'email field is required';
    }
    if (!firstName) {
        errors.firstName = 'first_name field is required';
    }
    if (!lastName) {
        errors.lastName = 'last_name field is required';
    }
    if (!password) {
        errors.password = 'password field is required';
    }

    //check password match
    if (password !== confirmPassword) {
        errors.password = 'password and confirm password does not match';
    }

    if (Object.keys(errors).length) {
        return res.json({errors: errors}).status(422);
    }

    let checkUser = await User.findOne({
        email: email.toLowerCase()
    });

    if (checkUser) {
        return res.json({
            errors:
                {'email': 'this email already used'}
        }).status(422);
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

    return res.json({
        user: createdUser,
        bearerToken: bearerToken,
    }).status(200);
};
