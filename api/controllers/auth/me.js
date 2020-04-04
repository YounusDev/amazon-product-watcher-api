module.exports = async function (req, res) {

    let userWithMeta = await User.withMeta({id: req.me.id});

    delete userWithMeta.password;
    delete userWithMeta.meta.userId;

    return res.json(userWithMeta).status(200);
};



