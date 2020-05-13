module.exports = async function (req, res) {

    let userProjectId = req.param('id');
    let status = req.param('status');
    let myUrl = req.param('my_url');
    let remoteUrl = req.param('remote_url');
    let linkInformation = req.param('link_information');

    let userProject = await UserDomain.findOne({
        id    : userProjectId,
        userId: req.me.id
    });

    if (!userProject) {
        return res.status(404).json({message: 'invalid project id'});
    }

    await UserDomain.updateOne({userId: req.me.id, id: userProject.id})
        .set({
            domainUseFor    : {
                guestPostService : {
                    status: status
                }
            }
        });

    if (myUrl) {
        await CheckLinkInGuestDomain.updateOne({userId: req.me.id, usersDomainsId: userProject.id})
            .set({
                url : {
                    myUrl
                }
            });
    }

    if (remoteUrl) {
        await CheckLinkInGuestDomain.updateOne({userId: req.me.id, usersDomainsId: userProject.id})
            .set({
                remoteUrl : {
                    remoteUrl
                }
            });
    }

    if (linkInformation) {
        await CheckLinkInGuestDomain.updateOne({userId: req.me.id, usersDomainsId: userProject.id})
            .set({
                linkInfo    : {
                    linkInformation
                }
            });
    }

    let guestLinkInfo = await CheckLinkInGuestDomain.find({
        usersDomainsId: userProject.id,
    });

    return res.status(200).json({
        guestPosts: guestLinkInfo
    });
}
