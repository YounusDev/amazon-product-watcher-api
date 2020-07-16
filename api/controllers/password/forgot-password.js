module.exports = async function (req, res) {

    if (!request.validate(req, res, {
        'email': 'required|email'
    })) return;

    let email = req.param('email');

    let userInfo = await User.findOne({
        email: email
    });

    if (!userInfo){
        return res.status(404).json({message: 'we can\'t find a user with that e-mail address'});
    }

    let token = commonHelpers.getCustomToken();

    //set token for the user
    await User.updateOne({email: email})
        .set({
            forgotPasswordToken: token,
            forgotPasswordTokenExpired: Date.now()+sails.config.custom.resetPasswordLinkExpireTime
        });

    //send email
    let resetUrl = sails.config.custom.clientEndpoint+'/auth/password/reset/'+token;
    await emails.passwordRecovery(userInfo.email, resetUrl);

    return res.status(200).json({
        send_reset_link: true
    });
};
