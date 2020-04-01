module.exports = async function (req, res) {

    if (!request.validate(req, res, {
        'first_name': 'string|required',
        'last_name': 'string|required'
    })) return;

    await UserMeta.updateOne({userId: req.me.id})
        .set({
            firstName: req.param('first_name'),
            lastName: req.param('last_name')
        });

    let userWithMeta = await User.withMeta({id: req.me.id});
    delete userWithMeta.password;

    return res.status(200).json({
        user: userWithMeta
    });
};
