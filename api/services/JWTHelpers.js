module.exports.checkToken = async function (req) {
    let authorizationHeader = req.headers.authorization || undefined;

    if (!authorizationHeader) {
        return false;
    }

    let token = _.split(authorizationHeader, 'Bearer ');
    if (token.length === 2 && token[1]) {
        try {
            let JWTStatus = await sails.JWT.verify(token[1], sails.config.custom.appSecret);

            req.me = JWTStatus.u;

            return true;
        } catch (e) {
            return false;
        }
    }

    return false;
};
