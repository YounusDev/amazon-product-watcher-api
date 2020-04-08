module.exports = async function (req, res) {

    let usersProjectId = req.param('id');


    let userProject = await UserDomain.findOne({
        id    : usersProjectId,
        userId: req.me.id
    });


    if (!userProject) {
        return res.status(404).json({message: 'invalid project id'});
    }

    if (!request.validate(req, res, {
        'project_name': 'required',
        'domain_url'  : 'required'
    })) return;


    // Domain URL update based on condition

    let domainUrl = req.param('domain_url');

    let domainInfo = await Domain.findOne({
        url: domainUrl,
    });


    if (domainInfo) {

        let checkUserDomain = await UserDomain.findOne({
            domainId: domainInfo.id,
            userId  : req.me.id
        });
        if (checkUserDomain) {
            return res.status(422).json({
                errors:
                    {'message': 'this domain Url already used'}
            });
        }


    }

    if (!domainInfo) {
        domainInfo = await Domain.create({
            url         : domainUrl,
            domainStatus: {}
        }).fetch();

        let domainMeta = await DomainMeta.create({
            domainId  : domainInfo.id,
            domainInfo: {}
        }).fetch();

        let userDomain = await UserDomain.create({
            projectName: req.param('project_name'),
            domainId: domainInfo.id,
            userId: req.me.id,
            domainUseFor: {}
        }).fetch();

        usersProjectId = domainInfo.id;
    }

    // Project Name will be Update

    await UserDomain.updateOne({userId: req.me.id, domainId: userProject.domainId})
        .set({
            projectName    : req.param('project_name')
        });


    let updatedProjectDetails = await UserDomain.withDomain({userId: req.me.id, domainId: usersProjectId});

    return res.status(200).json({
        project: updatedProjectDetails
    });
};
