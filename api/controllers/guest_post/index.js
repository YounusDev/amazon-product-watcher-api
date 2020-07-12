module.exports = async function (req, res) {
    let projectId = req.param('id');
    let searchExpr = req.param('s');
    let filterExpr = req.param('f');

    //check owner
    let userDomain = await UserDomain.findOne({
        id: projectId,
        userId: req.me.id
    });

    if (!userDomain) return res.status(404).json({ message: 'invalid project id' });

    let queryAndExpr = [
        { $eq: ['$user_domain_id', projectId] }
    ];

    if (searchExpr) {
        queryAndExpr.push({
            $regexFind: { input: '$guest_post_url', regex: searchExpr, options: 'i' }
        });
    }

    if (filterExpr && ['exist', 'not-exist'].includes(filterExpr)) {
        if (filterExpr === 'exist') {
            queryAndExpr.push({
                $ne: [
                    { $type: '$link_infos.exists' },
                    'missing'
                ]
            });
            queryAndExpr.push({
                $eq: ['$link_infos.exists', '1']
            })
        } else {
            queryAndExpr.push({
                $or: [
                    {
                        $eq: [
                            { $type: '$link_infos.exists' },
                            'missing'
                        ]
                    },
                    { $ne: ['$link_infos.exists', '1'] }
                ]
            });
        }
    }

    let linksInGuestPosts = await dbHelpers.get(
        LinkInGuestPost.linkInGuestPostAggregated,
        {
            bothStageQuery: {
                0: {
                    $match: {
                        $expr: { $and: queryAndExpr }
                    }
                }
            }
        },
        req
    );

    return res.status(200).json({ linksInGuestPosts: linksInGuestPosts });
};
