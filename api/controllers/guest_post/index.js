module.exports = async function (req, res) {
    let projectId = req.param('id');
    
    //check owner
    let userDomain = await UserDomain.findOne({
        id    : projectId,
        userId: req.me.id
    });
    
    if (!userDomain) return res.status(404).json({message: 'invalid project id'});
    
    let linksInGuestPosts = await dbHelpers.get(
        LinkInGuestPost.linkInGuestPostAggregated,
        {
            user_domain_id: projectId
        },
        req
    );
    
    return res.status(200).json({linksInGuestPosts: linksInGuestPosts});
};
