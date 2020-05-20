module.exports = async function (req, res) {

    if (!request.validate(req, res, {
        'first_name': 'required',
        'last_name': 'required',
        'email': 'required|email'
    })) return;

    let checkUser = await User.findOne({
        id: { '!=': req.me.id},
        email: req.param('email').toLowerCase()
    });

    if (checkUser) {
        return res.status(422).json({
            errors: {'email': 'this email already used'}
        });
    }

    await User.updateOne({id: req.me.id})
        .set({
            email: req.param('email')
        });

    await UserMeta.updateOne({userId: req.me.id})
        .set({
            firstName: req.param('first_name'),
            lastName: req.param('last_name'),
            address: req.param('address'),
            about_me: req.param('about_me')
        });

    let userWithMeta = await User.withMeta({id: req.me.id});
    delete userWithMeta.password;

    return res.status(200).json({
        user: userWithMeta
    });
};
