module.exports = async function (req, res) {

    //check already logged in
    if (!!JWTHelpers.hasToken(req)) return res.forbidden();

    if (!request.validate(req, res, {
        'email'     : 'required|email',
        'first_name': 'required',
        'last_name' : 'required',
        'password'  : 'required|confirmed',
        'verify_url' : 'required'
    })) return;

    let email     = req.param('email');
    let firstName = req.param('first_name');
    let lastName  = req.param('last_name');
    let address   = req.param('address');
    let password  = req.param('password');

    let checkUser = await User.findOne({
        email: email.toLowerCase()
    });

    if (checkUser) {
        return res.status(422).json({
            errors: {'email': 'this email already used'}
        });
    }

    let token = commonHelpers.getCustomToken();

    let createdUser = await User.create({
        email        : email,
        password     : await sails.helpers.passwords.hashPassword(password),
        validated    : true,
        verifyStatus : 0,
        verifyToken  : token
    }).fetch();

    let userMeta = await UserMeta.create({
        userId   : createdUser.id,
        firstName: firstName,
        lastName : lastName,
        address  : address
    }).fetch();

    //send verification email
    let verifyUrl = req.param('verify_url')+'/'+token;
    await emails.accountVerification(createdUser.email, verifyUrl);

    return res.status(200).json({
        registration: true
    });
};
