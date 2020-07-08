module.exports = async function (req, res) {

    if (!request.validate(req, res, {
        'email': 'required|email',
        'reset_url': 'required'
    })) return;

    let email = req.param('email');

    let userInfo = await User.findOne({
        email: email
    });

    if (!userInfo){
        return res.status(404).json({message: 'we can\'t find a user with that e-mail address'});
    }

    let token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2),
        resetUrl = req.param('reset_url')+'/'+token;

    //set token for the user
    await User.updateOne({email: email})
        .set({
            token: token,
            token_expired: Date.now()+sails.config.custom.resetPasswordLinkExpireTime
        });

    //send email
    await emails.passwordRecovery(userInfo.email, resetUrl);

    return res.status(200).json({
        send_reset_link: true,
        reset_url: resetUrl
    });
};
