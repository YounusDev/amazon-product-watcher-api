module.exports = async function (req, res) {
    let errors = {};

    let firstName = req.param('first_name');
    let lastName = req.param('last_name');

    if (!firstName) {
        errors.firstName = 'first_name field is required';
    }
    if (!lastName) {
        errors.lastName = 'last_name field is required';
    }

    if (Object.keys(errors).length) {
        return res.json({errors: errors}).status(422);
    }

    await UserMeta.updateOne({userId: req.me.id})
        .set({
            firstName: firstName,
            lastName: lastName
        });

    let userWithMeta = await User.withMeta({id: req.me.id});
    delete userWithMeta.password;

    return res.json({
        user: userWithMeta
    }).status(200);
};
