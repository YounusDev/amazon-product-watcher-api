module.exports = async function (req, res) {

    let projectId = req.param('project_id');

    //check owner
    let userDomain = await UserDomain.findOne({
        id: projectId,
        userId: req.me.id
    });

    if (!userDomain) {
        return res.status(404).json({message: 'invalid project id'});
    }

    let userDomainId = userDomain.id;

    let checkLinkInGuestDomains = await CheckLinkInGuestDomain.find({
        usersDomainsId: userDomainId
    });

    if (!checkLinkInGuestDomains) {
        return res.status(404).json({message: 'invalid project id'});
    }

    let checkLinkInGuestDomainsInfo = [];

    Object.keys(checkLinkInGuestDomains).forEach(objKey => {

        let checkLinkInGuestDomain = checkLinkInGuestDomains[objKey];

        checkLinkInGuestDomainsInfo.push({
            url: checkLinkInGuestDomain.url,
            remoteUrl: checkLinkInGuestDomain.remoteUrl,
            status: checkLinkInGuestDomain.linkInfo.status,
            lastUpdated: checkLinkInGuestDomain.createdAt
        });
    });

    return res.status(200).json(checkLinkInGuestDomainsInfo);
};
