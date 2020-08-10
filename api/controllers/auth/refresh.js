module.exports = async function (req, res) {
    let refreshToken = req.signedCookies.refreshToken;

    if (!refreshToken) {
        return res
            .status(422)
            .json({ errors: [], message: "Refresh token not found" });
    }

    try {
        let decodedRefreshToken = await sails.JWT.verify(
            refreshToken,
            sails.config.custom.appSecret
        );

        if (decodedRefreshToken.data.bearerToken === JWTHelpers.hasToken(req)) {
            let appSecret = sails.config.custom.appSecret;
            let jwtTime = sails.config.custom.jwtTime;
            let jwtRefreshTime = sails.config.custom.jwtRefreshTime;

            let bearerToken = await sails.JWT.sign(
                {
                    data: decodedRefreshToken.data.user,
                },
                appSecret,
                { expiresIn: jwtTime }
            );

            // we r setting again cz 2nd time prev bearer token gone so set with new
            // currently it works as lifetime. every time refresh call time extends
            // we r not reducing time from prev refresh token. minus if needed
            let refreshToken = await sails.JWT.sign(
                {
                    data: {
                        bearerToken: bearerToken,
                        user: decodedRefreshToken.data.user,
                    },
                },
                appSecret,
                { expiresIn: jwtRefreshTime / 1000 }
            );

            res.cookie("refreshToken", refreshToken, {
                maxAge: jwtRefreshTime,
                httpOnly: true,
                signed: true,
            });

            return res.status(200).json({
                bearerToken: bearerToken,
            });
        } else {
            return res
                .status(422)
                .json({ errors: [], message: "Bearer token invalid" });
        }
    } catch (e) {
        return res
            .json({ errors: [], message: "Bearer token invalid" })
            .status(422);
    }
};
