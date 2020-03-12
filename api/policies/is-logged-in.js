module.exports = async function (req, res, proceed) {
    if (! await JWTHelpers.checkToken(req)) {
        return res.unauthorized();
    }

    return proceed();
};
