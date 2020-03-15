module.exports = async function (req, res, proceed) {
    if (! req.signedCookies.refreshToken || ! await JWTHelpers.checkToken(req)) {
        return res.unauthorized();
    }

    return proceed();
};
