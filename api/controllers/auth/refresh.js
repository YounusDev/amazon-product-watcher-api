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
            /*let userRecord = await User.withMeta({
                id: req.me.id
            });*/

            // delete userRecord.password;

            let appSecret = sails.config.custom.appSecret;
            let jwtTime = sails.config.custom.jwtTime;
            // let userWithoutMeta = _.cloneDeep(userRecord); // get userWithUserMeta data copy

            // delete userWithoutMeta.meta; //remove meta from userWithUserMeta

            let bearerToken = await sails.JWT.sign({
                data: decodedRefreshToken.data.user
                // data: userWithoutMeta // assign only user data
            }, appSecret, {expiresIn: jwtTime});
            return res.json({
                // user: userRecord, // send userWithUserMeta
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
