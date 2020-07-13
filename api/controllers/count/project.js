module.exports = async function (req, res) {
    let projectsCount = await dbHelpers.get(
        UserDomain.userDomainAggregated,
        {
            bothStageQuery: {
                0: {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: [
                                        '$user_id',
                                        req.me.id
                                    ]
                                }
                            ]
                        }
                    }
                },
                1: {
                    $group: {
                        _id: '$_id',
                        active: {
                            $sum: {
                                $cond: {
                                    if: { $eq: ['$deactivated_at', ''] },
                                    then: 1,
                                    else: 0
                                }
                            }
                        },
                        inactive: {
                            $sum: {
                                $cond: {
                                    if: { $eq: ['$deactivated_at', ''] },
                                    then: 0,
                                    else: 1
                                }
                            }
                        },
                        user_domain_set: { $addToSet: '$$ROOT' }
                    }
                },
                2: {
                    $addFields: {
                        user_domain: { $arrayElemAt: ['$user_domain_set', 0] }
                    }
                },
                3: { $project: { user_domain_set: 0 } }
            }
        },
        req
    );

    return res.status(200).json({ projectsCount: projectsCount });
};