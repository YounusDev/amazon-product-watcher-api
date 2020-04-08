module.exports = async function (req, res) {

    let userProjectId = req.param('id');
    let status = req.param('status');

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


    let updatedGuestPost = await UserDomain.withDomain({userId: req.me.id, id: userProject.id});

    return res.status(200).json({
        guestPosts: updatedGuestPost
    });
}
