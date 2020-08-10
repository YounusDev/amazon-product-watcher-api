module.exports = async function (req, res) {
    let usersDomainId = req.param("id");
    let logType = req.param("log_type") || "ping";
    // let time_upto = req.param('time_upto') ? parseInt(req.param('time_upto')) : 0;
    // let interval = req.param('interval') || 'min';

    let userDomain = await UserDomain.findOne({
        id: usersDomainId,
        userId: req.me.id,
    });

    if (!userDomain) {
        return res.status(404).json({ message: "invalid project id" });
    }

    // finally convert to millisecond
    let monthTimeInMilSecond = 60 * 60 * 24 * 30 * 1000;

    let time_from = new Date().getTime() - monthTimeInMilSecond;

    let domainUptimeTimeline = await dbHelpers.get(
        ServiceLog.serviceLogAggregated,
        {
            bothStageQuery: {
                0: {
                    $match: {
                        domain_id: userDomain.domainId,
                        service_type: "uptime",
                        child_service_type: logType,
                        $expr: {
                            $gt: ["$logged_at", time_from],
                        },
                    },
                },
                1: {
                    $lookup: {
                        from: "users_domains",
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: [
                                                    { $toString: "$_id" },
                                                    usersDomainId,
                                                ],
                                            },
                                            // {
                                            //     $eq: [
                                            //         '$user_id',
                                            //         req.me.id
                                            //     ]
                                            // },
                                            {
                                                $ne: [
                                                    {
                                                        $type:
                                                            "$domain_use_for.domain_uptime_check_service",
                                                    },
                                                    "missing",
                                                ],
                                            },
                                            {
                                                $ne: [
                                                    {
                                                        $type:
                                                            "$domain_use_for.domain_uptime_check_service.check_types",
                                                    },
                                                    "missing",
                                                ],
                                            },
                                            {
                                                $ne: [
                                                    {
                                                        $type:
                                                            "$domain_use_for.domain_uptime_check_service.status",
                                                    },
                                                    "missing",
                                                ],
                                            },
                                            // currently if service inactive or not started from start we are showing result
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "user_domain",
                    },
                },
                2: {
                    $unwind: "$user_domain",
                },
                3: {
                    $project: {
                        _id: 1,
                        info: 1,
                        status: 1,
                        logged_at: 1,
                    },
                },
                4: {
                    $sort: { logged_at: -1 },
                },
                // 5: {
                //     $group: {
                //         _id: {
                //             month: { $month: { $convert: { input: '$logged_at', to: 'date' } } },
                //             day: { $dayOfMonth: { $convert: { input: '$logged_at', to: 'date' } } },
                //             hour: { $hour: { $convert: { input: '$logged_at', to: 'date' } } },
                //         },
                //         logs: { $push: '$$ROOT' },
                //     }
                // },
                // 6: {
                //     $group: {
                //         _id: '$_id.hour',
                //         logs: { $push: '$$ROOT' }
                //     }
                // },
                // 7: {
                //     $addFields: { id_type: 'hour' }
                // },
                // 8: {
                //     $sort: { id: -1 }
                // }
            },
        },
        req,
        50000
    );

    return res.status(200).json({ domainUptimeTimeline: domainUptimeTimeline });
};
