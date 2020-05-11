module.exports = async function (req, res) {

    // use db helpers get func only for normal find. nor findOne. only find support given
    let userProject = await dbHelpers.get(
        UserDomain.withDomainAggregated,
        {userId: req.me.id},
        req
    );

    if (!userProject || !userProject.data.length) {
        return res.status(404).json({message: 'user has no projects'});
    }

    return res.status(200).json({
        userProject: userProject
    });
};
