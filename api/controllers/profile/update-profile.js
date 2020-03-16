module.exports = async function (req, res) {
    let errors = {};

    if (!request.validate(req, res, {
        'first_name': 'string|required',
        'last_name': {
            rule: 'required|string'
        },
    })) return;
    console.log(req.param('first_name'), req.param('last_name'))

    await UserMeta.updateOne({userId: req.me.id})
        .set({
            firstName: req.param('first_name'),
            lastName: req.param('last_name')
        });

    let userWithMeta = await User.withMeta({id: req.me.id});
    delete userWithMeta.password;

    return res.json({
        user: userWithMeta
    }).status(200);
};

/*
async function validate(req, res, fields) {
}
*/
