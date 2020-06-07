module.exports = async function (req, res) {
    let usersDomainId = req.param('id');

    let userDomain = await UserDomain.findOne({
        id    : usersDomainId,
        userId: req.me.id
    });

    if (!userDomain) {
        return res.status(404).json({message: 'invalid project id'});
    }

    let domainUptimeDetails = await dbHelpers.getSingle(
        Domain.domainAggregated,
        [
            {
                $lookup: {
                    from    : 'users_domains',
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: [
                                                {$toString: '$_id'},
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
                    as      : 'user_domain'
                }
            },

            {$unwind: '$user_domain'},

            {
                $lookup: {
                    from    : 'domains_meta',
                    let     : {domain_id: {$toString: '$_id'}},
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: [
                                                '$$domain_id',
                                                '$domain_id'
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    as      : 'meta'
                }
            },

            {
                $unwind: {
                    path                      : '$meta',
                    preserveNullAndEmptyArrays: true
                }
            }
        ],
        req
    );

    return res.status(200).json({domainUptimeDetails: domainUptimeDetails});
};

