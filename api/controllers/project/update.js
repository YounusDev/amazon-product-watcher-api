module.exports = async function (req, res) {
    let usersProjectId = req.param('id');
    let activeStatus   = req.param('active_status');
    
    let userProject = await UserDomain.findOne({
        id    : usersProjectId,
        userId: req.me.id
    });
    
    if (!userProject) {
        return res.status(404).json({message: 'invalid project id'});
    }
    
    if (!request.validate(req, res, {
        'project_name': 'required'
    })) return;
    
    // Project Name will be Update
    let updatedProject = commonHelpers.objectKeysToSnakeCase(
        await UserDomain.updateOne({
            userId: req.me.id,
            domainId: userProject.domainId
        })
            .set({
                projectName  : req.param('project_name'),
                deactivatedAt: req.param('active_status') ? '' : Date.now()
            })
    );
    
    return res.status(200).json({
        project: updatedProject
    });
};
