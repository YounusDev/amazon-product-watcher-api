module.exports = async function (req, res) {
    let usersDomainId = req.param("id");
    let searchExpr = req.param("s");

    let userDomain = await UserDomain.findOne({
        id: usersDomainId,
        userId: req.me.id,
    });

    if (!userDomain) {
        return res.status(404).json({ message: "invalid project id" });
    }

    let queryAndExpr = [];

    if (searchExpr) {
        queryAndExpr.push({
            $regexFind: { input: "$url", regex: searchExpr, options: "i" },
        });
    }

    let pageSpeedResults = await dbHelpers.get(
        Page.pageAggregated,
        {
            bothStageQuery: {
                0: {
                    $match: {
                        $expr: { $and: queryAndExpr },
                    },
                },
                1: {
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
                                            {
                                                $ne: [
                                                    {
                                                        $type:
                                                            "$domain_use_for.pages_speed_check_service",
                                                    },
                                                    "missing",
                                                ],
                                            },
                                            {
                                                $ne: [
                                                    {
                                                        $type:
                                                            "$domain_use_for.pages_speed_check_service.status",
                                                    },
                                                    "missing",
                                                ],
                                            },
                                            {
                                                $eq: [
                                                    "$domain_use_for.pages_speed_check_service.status",
                                                    "active",
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
                2: { $unwind: "$user_domain" },
                3: {
                    $lookup: {
                        from: "pages_meta",
                        let: { id: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [
                                            { $toString: "$$id" },
                                            "$page_id",
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "meta",
                    },
                },
                4: {
                    // cant use this cz page_meta can be empty
                    // unwind: '$meta'
                    $unwind: {
                        path: "$meta",
                        preserveNullAndEmptyArrays: true,
                    },
                },
            },
        },
        req
    );

    return res.status(200).json({ pageSpeedResults: pageSpeedResults });
};
