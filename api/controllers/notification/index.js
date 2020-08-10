module.exports = async function (req, res) {
    // finally convert to millisecond
    let monthTimeInSecond = 60 * 60 * 24 * 30 * 1000;

    let notifications = await dbHelpers.get(
        ServiceLog.serviceLogAggregated,
        {
            bothStageQuery: {
                0: {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $ne: ["$status", "ok"],
                                },
                                {
                                    $gt: ["$logged_at", monthTimeInSecond],
                                },
                            ],
                        },
                    },
                },
                1: { $sort: { logged_at: -1 } },
                2: {
                    $lookup: {
                        from: "users_domains",
                        let: { domain_id: "$domain_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ["$user_id", req.me.id],
                                            },
                                            {
                                                $eq: [
                                                    "$domain_id",
                                                    "$$domain_id",
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "user_domain",
                    },
                },
                3: { $unwind: "$user_domain" },
                4: {
                    $group: {
                        _id: {
                            uid: { $toString: "$user_domain._id" },
                            typ: "$service_type",
                        },
                        logs: { $push: "$$ROOT" },
                    },
                },
                5: {
                    $addFields: {
                        service_type: "$_id.typ",
                    },
                },
                6: {
                    $project: {
                        _id: 0,
                        logs: { $slice: ["$logs", 5] },
                        service_type: 1,
                    },
                },
                7: {
                    $unwind: "$logs",
                },
                8: {
                    $addFields: {
                        _id: "$logs._id",
                        log: "$logs",
                        seen: {
                            $cond: {
                                if: {
                                    $in: [
                                        "$logs.user_domain.user_id",
                                        "$logs.seen_by",
                                    ],
                                },
                                then: true,
                                else: false,
                            },
                        },
                    },
                },
                9: {
                    $project: {
                        logs: 0,
                        "log.seen_by": 0,
                    },
                },
                10: {
                    $sort: { "log.logged_at": -1 },
                },
            },
        },
        req
    );

    return res.status(200).json({ notifications: notifications });
};
