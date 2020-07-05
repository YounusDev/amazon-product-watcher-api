module.exports = async function (req, res) {

    if (!request.validate(req, res, {
        'email': 'required|email',
        'token': 'required',
        'password' : 'required|confirmed'
    })) return;

    let email = req.param('email');
    let token = req.param('token');
    let password = req.param('password');

    let userInfo = await User.findOne({
        email: email,
        token: token
    });

    if (!userInfo){
        return res.status(404).json({message: 'email or token does not match'});
    }

    //check token expire time
    if (Date.now() > userInfo.token_expired){
        return res.status(404).json({message: 'your token has been expired'});
    }

    //reset password and token null for the user
    await User.updateOne({
        email: email,
        token: token
    }).set({
        password: await sails.helpers.passwords.hashPassword(password),
        token: '',
        token_expired: ''
    });

    return res.status(200).json({
        reset_password: true,
    });
};
