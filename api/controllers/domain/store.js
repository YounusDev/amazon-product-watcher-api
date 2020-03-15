module.exports = async function (req, res) {

    let errors = {};

    let domainUrl = req.param('domain_url');
    let projectName = req.param('project_name');

    if (!domainUrl) {
        errors.domainUrl = 'domain_url field is required';
    }
    if (!projectName) {
        errors.domainUrl = 'project_name field is required';
    }

    if (Object.keys(errors).length) {
        return res.json({errors: errors}).status(422);
    }

    let domainInfo = await Domain.findOne({
        url: domainUrl,
    });

    if(domainInfo){
        let checkUserDomain = await UserDomain.findOne({
            domainId: domainInfo.id,
            userId: req.me.id
        });

        if (checkUserDomain){
            return res.json({
                errors:
                    {'message': 'this domain Url already used'}
            }).status(422);
        }
    }

    if (!domainInfo){
        domainInfo = await Domain.create({
            url : domainUrl,
            domainStatus: {}
        }).fetch();

        let domainMeta = await DomainMeta.create({
            domainId: domainInfo.id,
            domainInfo: {}
        }).fetch();
    }

    let userDomain = await UserDomain.create({
        projectName: projectName,
        domainId: domainInfo.id,
        userId: req.me.id,
        domainUseFor: {}
    }).fetch();

    return res.json({
        domainMeta: domainInfo,
        userDomain: userDomain,
    }).status(200);
};
