module.exports = async function (req, res) {
    let latestScrapedPages = await dbHelpers.get(
        Page.pageAggregated,
        {
            bothStageQuery: {
                0: {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $ne: [{ $type: "$updated_at" }, "missing"],
                                },
                                {
                                    $ne: [
                                        {
                                            $type:
                                                "$updated_at.last_scraped_at",
                                        },
                                        "missing",
                                    ],
                                },
                            ],
                        },
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
                    $sort: { "updated_at.last_scraped_at": -1 },
                },
                5: {
                    $limit: 5,
                },
            },
        },
        req
    );

    return res.status(200).json({ latestScrapedPages: latestScrapedPages });
};
