module.exports = async function (req, res) {

    if (!request.validate(req, res, {
        'password' : 'required|confirmed'
    })) return;

    let password = req.param('password');

    await User.updateOne({id: req.me.id})
        .set({
            password: await sails.helpers.passwords.hashPassword(password),
        });

    return res.status(200).json({password_update: true});
};
