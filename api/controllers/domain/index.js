module.exports = async function (req, res) {

    let errors = {};

    // let domainUrl = req.param('domain_url');
    //
    // if (!domainUrl) {
    //     errors.domainUrl = 'domain_url field is required';
    // }

    if (Object.keys(errors).length) {
        return res.status(422).json({errors: errors});
    }

    let userProject = await UserDomain.withDomain({
        userId: req.me.id,
    });

    if (!userProject) {
        return res.status(404).json({message: 'domain record does not found'});
    }

    return res.status(200).json({
        userProject : userProject
    });
};
