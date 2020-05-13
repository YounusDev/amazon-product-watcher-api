module.exports = async function (req, res) {
    if (!request.validate(req, res, {
        'domain_url'  : 'required',
        'project_name': 'required'
    })) return;
    
    let domainUrl   = req.param('domain_url');
    let projectName = req.param('project_name');
    
    let domainInfo = await Domain.findOne({
        url: domainUrl,
    });
    
    if (domainInfo) {
        let checkUserDomain = await UserDomain.findOne({
            domainId: domainInfo.id,
            userId  : req.me.id
        });
        
        if (checkUserDomain) {
            return res.status(422).json({message: 'this Domain is already used'});
        }
    } else {
        domainInfo = await Domain.create({
            url: domainUrl
        }).fetch();
    }
    
    let userDomain = commonHelpers.objectKeysToSnakeCase(await UserDomain.create({
        projectName : projectName,
        domainId    : domainInfo.id,
        userId      : req.me.id,
        domainUseFor: {}
    }).fetch());
    
    return res.status(200).json({
        project: userDomain
    });
};
