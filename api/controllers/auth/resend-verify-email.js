module.exports = async function (req, res) {

    if (!request.validate(req, res, {
        'email' : 'required|email',
        'verify_url' : 'required'
    })) return;

    let email = req.param('email');

    let checkUser = await User.findOne({
        email: email.toLowerCase()
    });

    if (!checkUser) {
        return res.status(404).json({message: 'email does not match'});
    }

    if (checkUser.verifyStatus === 1) {
        return res.status(200).json({already_verify: true});
    }

    let token = commonHelpers.getCustomToken();

    //set token for the user
    await User.updateOne({email: email})
        .set({
            verifyToken: token
        });

    //send email
    let verifyUrl = req.param('verify_url')+'/'+token;
    await emails.accountVerification(checkUser.email, verifyUrl);

    return res.status(200).json({
        send_verification_email: true
    });
};
