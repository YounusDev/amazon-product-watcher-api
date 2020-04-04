module.exports = async function (req, res, proceed) {
    if (!req.signedCookies.refreshToken || !await JWTHelpers.hasToken(req)) {
        return res.unauthorized();
    }

    if (!await JWTHelpers.checkToken(req)) {
        return res.expired();
    }

    return proceed();
};
