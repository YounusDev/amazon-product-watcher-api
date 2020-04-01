module.exports = async function (req, res) {
    let refreshToken = req.signedCookies.refreshToken;

    if (!refreshToken){
        return res.status(422).json(
            {errors: ['refresh token not found']}
        );
    }

    try {
        let decodedRefreshToken = await sails.JWT.verify(refreshToken, sails.config.custom.appSecret);

        if (decodedRefreshToken.data.bearerToken === JWTHelpers.hasToken(req)){

            let appSecret = sails.config.custom.appSecret;
            let jwtTime = sails.config.custom.jwtTime;

            let bearerToken = await sails.JWT.sign({
                data: decodedRefreshToken.data.user
            }, appSecret, {expiresIn: jwtTime});

            return res.status(200).json({
                bearerToken: bearerToken,
            });

        } else {
            return res.status(422).json(
                {errors: ['refresh token not found']}
            );
        }
    } catch (e) {
        return res.status(422).json(
            {errors: ['refresh token not found']}
        );
    }
};
