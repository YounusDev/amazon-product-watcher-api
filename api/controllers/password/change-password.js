module.exports = async function (req, res) {

    if (!request.validate(req, res, {
        'password' : 'required|confirmed'
    })) return;

    let password = req.param('password');

    let userRecord = await User.findOne({
        id: req.me.id
    });

    try {
        await sails.helpers.passwords.checkPassword(password, userRecord.password);

        return res.status(404).json({message: 'you can not use your old password'});
    } catch (e) {

        await User.updateOne({id: req.me.id})
            .set({
                password: await sails.helpers.passwords.hashPassword(password),
            });

        return res.status(200).json({password_update: true});
    }
};
