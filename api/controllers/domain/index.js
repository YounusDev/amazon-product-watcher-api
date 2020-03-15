module.exports = async function (req, res) {

    let errors = {};

    let domainUrl = req.param('domain_url');

    if (!domainUrl) {
        errors.domainUrl = 'domain_url field is required';
    }

    if (Object.keys(errors).length) {
        return res.json({errors: errors}).status(422);
    }

    let domainRecord = await Domain.withMeta({
        url: domainUrl
    });

    if (!domainRecord) {
        return res.json({message: 'domain record does not found'}).status(404);
    }

    return res.json({
        domain: domainRecord, // send domainWithDomainMeta
    }).status(200);
};
