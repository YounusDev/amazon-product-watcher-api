module.exports = async function (req, res) {
    let userProjectId = req.param("id");
    let status = req.param("status");

    let userProject = await UserDomain.findOne({
        id: userProjectId,
        userId: req.me.id,
    });

    if (!userProject) {
        return res.status(404).json({ message: "invalid project id" });
    }

    // it will try to preserve domain use for nested objects
    // cz updated one cant update only a single key of a nested object
    let prevDomainUseFor = _.cloneDeep(userProject.domainUseFor);
    if (!prevDomainUseFor.hasOwnProperty("amazonProductsCheckService")) {
        prevDomainUseFor["amazon_products_check_service"] = {};
    }

    let modifiedDomainUseFor = prevDomainUseFor;
    modifiedDomainUseFor.amazon_products_check_service["status"] = status;

    let updatedProjectService = await UserDomain.updateOne({
        userId: req.me.id,
        id: userProject.id,
    }).set({
        domainUseFor: modifiedDomainUseFor,
    });

    return res.status(200).json({
        project: commonHelpers.objectKeysToSnakeCase(updatedProjectService),
    });
};
