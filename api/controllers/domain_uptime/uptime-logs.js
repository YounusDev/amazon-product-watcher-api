module.exports = async function (req, res) {
    let usersDomainId = req.param('id');
    let logType = req.param('log_type') || 'ping';

    let userDomain = await UserDomain.findOne({
        id: usersDomainId,
        userId: req.me.id
    });

    if (!userDomain) {
        return res.status(404).json({ message: 'invalid project id' });
    }

    let domainUptimeLogs = await dbHelpers.get(
        ServiceLog.serviceLogAggregated,
        {
            bothStageQuery: {
                0: {
                    $match: {
                        domain_id: userDomain.domainId,
                        service_type: 'uptime',
                        child_service_type: logType
                    }
                },
                1: {
                    $lookup: {
                        from: 'users_domains',
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: [
                                                    { $toString: '$_id' },
                                                    usersDomainId
                                                ]
                                            },
                                            {
                                                $eq: [
                                                    '$user_id',
                                                    req.me.id
                                                ]
                                            },
                                            {
                                                $ne: [
                                                    {
                                                        $type: '$domain_use_for.domain_uptime_check_service'
                                                    },
                                                    'missing'
                                                ]
                                            },
                                            {
                                                $ne: [
                                                    {
                                                        $type: '$domain_use_for.domain_uptime_check_service.check_types'
                                                    },
                                                    'missing'
                                                ]
                                            },
                                            {
                                                $ne: [
                                                    {
                                                        $type: '$domain_use_for.domain_uptime_check_service.status'
                                                    },
                                                    'missing'
                                                ]
                                            },
                                            // currently if service inactive or not started from start we are showing result
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'user_domain'
                    }
                },
                2: {
                    $unwind: '$user_domain'
                },
                3: {
                    $sort: { logged_at: -1 }
                }
            }
        },
        req
    );

    return res.status(200).json({ domainUptimeLogs: domainUptimeLogs });
};

