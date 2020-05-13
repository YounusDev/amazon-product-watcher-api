module.exports = async function (req, res) {
    
    let projectId = req.param('project_id');
    
    let userDomain = await UserDomain.findOne({
        id    : projectId,
        userId: req.me.id
    });
    
    if (!userDomain) {
        return res.status(404).json({message: 'invalid project id'});
    }
    
    // use db helpers get func only for normal find. nor findOne. only find support given
    let pagesResult = await dbHelpers.get(
        Page.pageAggregated,
        {
            where : {domain_id: userDomain.domainId},
            lookup: {
                from    : 'pages_meta',
                let     : {id: '$_id'},
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    {$toString: '$$id'},
                                    '$page_id'
                                ]
                            }
                        }
                    }
                ],
                as      : 'meta'
            },
            // cant use this cz page_meta can be empty
            // unwind: '$meta'
            unwind: {
                path                      : '$meta',
                preserveNullAndEmptyArrays: true
            }
        },
        req
    );
    
    return res.status(200).json({brokenLinks: pagesResult});
};
