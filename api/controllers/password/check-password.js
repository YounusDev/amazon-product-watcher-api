module.exports = async function (req, res) {
    if (
        !request.validate(req, res, {
            current_password: "required",
        })
    )
        return;

    let userRecord = await User.findOne({
        id: req.me.id,
    });

    try {
        await sails.helpers.passwords.checkPassword(
            req.param("current_password"),
            userRecord.password
        );
    } catch (e) {
        return res.status(404).json({ message: "password does not match" });
    }

    return res.status(200).json({ password_match: true });
};
