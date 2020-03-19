module.exports = async function (req, res) {
    let refreshToken = req.signedCookies.refreshToken;

    if (!refreshToken){
        return res.json(
            {errors: ['refresh token not found']}
        ).status(422);
    }

    try {
        let decodedRefreshToken = await sails.JWT.verify(refreshToken, sails.config.custom.appSecret);

        if (decodedRefreshToken.data.bearerToken === JWTHelpers.hasToken(req)){

            let appSecret = sails.config.custom.appSecret;
            let jwtTime = sails.config.custom.jwtTime;

            let bearerToken = await sails.JWT.sign({
                data: decodedRefreshToken.data.user
            }, appSecret, {expiresIn: jwtTime});
            return res.json({
                bearerToken: bearerToken,
            }).status(200);

        } else {
            return res.json(
                {errors: ['refresh token not found']}
            ).status(422);
        }
    } catch (e) {
        return res.json(
            {errors: ['refresh token not found']}
        ).status(422);
    }
};
