module.exports.checkToken = async function (req) {
    let token = this.hasToken(req);

    if (!!token) {
        try {
            let JWTStatus = await sails.JWT.verify(
                token,
                sails.config.custom.appSecret
            );

            req.me = JWTStatus.data;

            return true;
        } catch (e) {
            return false;
        }
    }

    return false;
};

module.exports.hasToken = function (req) {
    let authorizationHeader = req.headers.authorization || undefined;

    if (authorizationHeader) {
        let token = _.split(authorizationHeader, "Bearer ");

        if (token.length === 2 && token[1]) {
            return token[1];
        }
    }

    return false;
};
