module.exports = async function (req, res) {
    if (
        !request.validate(req, res, {
            token: "required",
        })
    )
        return;

    let token = req.param("token");

    let checkUser = await User.findOne({
        verifyToken: token,
    });

    if (!checkUser) {
        return res.status(404).json({ message: "token is invalid" });
    }

    //check token expire time
    if (Date.now() > checkUser.verifyTokenExpired) {
        return res.status(200).json({ token_expired: true });
    }

    if (checkUser.verifyStatus) {
        return res.status(200).json({ already_verify: true });
    }

    await User.updateOne({ verifyToken: token }).set({
        verifyStatus: 1,
        verifyToken: "",
        verifyTokenExpired: "",
    });

    return res.status(200).json({
        account_verification: true,
    });
};
