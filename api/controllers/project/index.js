module.exports = async function (req, res) {
    let searchExpr = req.param('s');
    let filterExpr = req.param('f');

    let query = {
        0: {
            $match: {
                $expr: {
                    $and: [
                        { $eq: ['$user_id', req.me.id] }
                    ]
                }
            }
        },
        1: {
            $lookup: {
                from: 'domains',
                let: { domainId: '$domain_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: [
                                            { $toString: '$_id' },
                                            '$$domainId'
                                        ]
                                    }
                                ]
                            }
                        },
                    },
                    {
                        $lookup: {
                            from: 'domains_meta',
                            // let: { domainId: { $toString: '$_id' } },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ['$domain_id', '$$domainId'] }
                                            ]
                                        }
                                    },

                                }
                            ],
                            as: 'meta'
                        }
                    },
                    {
                        $unwind: {
                            path: '$meta',
                            preserveNullAndEmptyArrays: true
                        }
                    }
                ],
                as: 'domain'
            }
        },
        2: { $unwind: '$domain' }
    };

    if (searchExpr) {
        query['0']['$match']['$expr']['$and'].push({
            $regexFind: { input: '$project_name', regex: searchExpr, options: 'i' }
        });
    }

    if (filterExpr && ['active', 'inactive'].includes(filterExpr)) {
        query['0']['$match']['$expr']['$and'].push({
            [filterExpr === 'active' ? '$eq' : '$ne']: ['$deactivated_at', '']
        });
    }

    // use db helpers get func only for normal find. nor findOne. only find support given
    let userProjects = await dbHelpers.get(
        UserDomain.userDomainAggregated,
        { bothStageQuery: query },
        req
    );

    return res.status(200).json({
        userProjects: userProjects
    });
};
