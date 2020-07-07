module.exports = async function (req, res) {
    let latestIssues = await dbHelpers.get(
        ServiceLog.serviceLogAggregated,
        {
            bothStageQuery: {
                0: {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $ne: ['$status', 'ok']
                                }
                            ]
                        }
                    }
                },
                1: {
                    $lookup: {
                        from: 'users_domains',
                        let: { domain_id: '$domain_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: [
                                                    '$user_id',
                                                    req.me.id
                                                ],
                                            },
                                            {
                                                $eq: [
                                                    '$domain_id',
                                                    '$$domain_id'
                                                ],
                                            }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'user_domain'
                    }
                },
                2: { $unwind: '$user_domain' },
                3: {
                    $project: {
                        seen_by: 0,
                        'user_domain.domain_use_for': 0
                    }
                },
                4: {
                    $sort: { 'logged_at': -1 }
                },
                5: {
                    $limit: 5
                }
            }
        },
        req
    );

    return res.status(200).json({ latestIssues: latestIssues });
};

