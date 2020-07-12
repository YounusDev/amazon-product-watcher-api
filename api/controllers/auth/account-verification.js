module.exports = async function (req, res) {

    if (!request.validate(req, res, {
        'token' : 'required'
    })) return;

    let token = req.param('token');

    let checkUser = await User.findOne({
        verifyToken: token
    });

    if (!checkUser) {
        return res.status(404).json({message: 'token is invalid'});
    }

    if (checkUser.verifyStatus === 1) {
        return res.status(200).json({already_verify: true});
    }

    await User.updateOne({verifyToken: token})
        .set({
            verifyStatus: 1,
            verifyToken: ''
        });

    return res.status(200).json({
        account_verification: true
    });
};
