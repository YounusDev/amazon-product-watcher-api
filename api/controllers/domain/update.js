module.exports = async function (req, res) {

    let usersProjectId = req.param('id');

    let userProject = await UserDomain.findOne({
        domainId: usersProjectId,
        userId: req.me.id
    });

    if (!userProject) {
        return res.status(404).json({message: 'invalid project id'});
    }

    if (!request.validate(req, res, {
        'project_name': 'required',
        'domain_url': 'required'
    })) return;

    await UserDomain.updateOne({userId: req.me.id})
        .set({
            projectName: req.param('project_name')
        });

    await Domain.updateOne({id: usersProjectId})
        .set({
            url: req.param('domain_url')
        });

    let updatedProjectDetails = await UserDomain.withDomain({domainId: usersProjectId});

    return res.status(200).json({
        project: updatedProjectDetails
    });
};
