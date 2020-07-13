module.exports = async function (req, res) {

    if (!request.validate(req, res, {
        'email': 'required|email',
        'token': 'required',
        'password' : 'required|confirmed|min:6'
    })) return;

    let email = req.param('email');
    let token = req.param('token');
    let password = req.param('password');

    let userEmail = await User.findOne({
        email: email,
    });

    if (!userEmail){
        return res.status(404).json({message: 'email does not match'});
    }

    let userToken = await User.findOne({
        forgotPasswordToken: token
    });

    if (!userToken){
        return res.status(404).json({message: 'token is invalid'});
    }

    //check token expire time
    if (Date.now() > userEmail.forgotPasswordTokenExpired){
        return res.status(404).json({message: 'your token has been expired'});
    }

    //reset password and token null for the user
    await User.updateOne({
        email: email,
        forgotPasswordToken: token
    }).set({
        password: await sails.helpers.passwords.hashPassword(password),
        forgotPasswordToken: '',
        forgotPasswordTokenExpired: ''
    });

    return res.status(200).json({
        reset_password: true,
    });
};
