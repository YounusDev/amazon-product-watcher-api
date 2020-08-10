module.exports = async function (req, res) {
    let productsCount = await dbHelpers.get(
        AmazonProductInPage.amazonProductsInPagesAggregated,
        {
            bothStageQuery: {
                0: {
                    $lookup: {
                        from: "users_domains",
                        let: { user_domain_id: "$user_domain_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$user_id", req.me.id] },
                                            {
                                                $eq: [
                                                    "$$user_domain_id",
                                                    { $toString: "$_id" },
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
                1: { $unwind: "$user_domain" },
                2: {
                    $lookup: {
                        from: "amazon_products_meta",
                        let: { amazon_product_id: "$product_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: [
                                                    "$$amazon_product_id",
                                                    "$amazon_product_id",
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "product_meta",
                    },
                },
                3: { $unwind: "$product_meta" }, // keep empty meta if needed
                4: {
                    $group: {
                        _id: "$user_domain_id",
                        available: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $and: [
                                            {
                                                $in: [
                                                    {
                                                        $substr: [
                                                            {
                                                                $toString:
                                                                    "$product_meta.page_status",
                                                            },
                                                            0,
                                                            1,
                                                        ],
                                                    },
                                                    ["2", "3"],
                                                ],
                                            },
                                            {
                                                $ne: [
                                                    {
                                                        $type:
                                                            "$product_meta.metas.in_stock",
                                                    },
                                                    "missing",
                                                ],
                                            },
                                            {
                                                $gt: [
                                                    {
                                                        $convert: {
                                                            input:
                                                                "$product_meta.metas.in_stock",
                                                            to: "int",
                                                            onError: 0,
                                                            onNull: 0,
                                                        },
                                                    },
                                                    0,
                                                ],
                                            },
                                        ],
                                    },
                                    then: 1,
                                    else: 0,
                                },
                            },
                        },
                        unavailable: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $and: [
                                            {
                                                $in: [
                                                    {
                                                        $substr: [
                                                            {
                                                                $toString:
                                                                    "$product_meta.page_status",
                                                            },
                                                            0,
                                                            1,
                                                        ],
                                                    },
                                                    ["2", "3"],
                                                ],
                                            },
                                            {
                                                $ne: [
                                                    {
                                                        $type:
                                                            "$product_meta.metas.in_stock",
                                                    },
                                                    "missing",
                                                ],
                                            },
                                            {
                                                $lt: [
                                                    {
                                                        $convert: {
                                                            input:
                                                                "$product_meta.metas.in_stock",
                                                            to: "int",
                                                            onError: 0,
                                                            onNull: 0,
                                                        },
                                                    },
                                                    1,
                                                ],
                                            },
                                        ],
                                    },
                                    then: 1,
                                    else: 0,
                                },
                            },
                        },
                        status_404: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $eq: ["$product_meta.page_status", 404],
                                    },
                                    then: 1,
                                    else: 0,
                                },
                            },
                        },
                        other_error: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $not: [
                                            {
                                                $in: [
                                                    {
                                                        $substr: [
                                                            {
                                                                $toString:
                                                                    "$product_meta.page_status",
                                                            },
                                                            0,
                                                            1,
                                                        ],
                                                    },
                                                    ["2", "3", "4"],
                                                ],
                                            },
                                        ],
                                    },
                                    then: 1,
                                    else: 0,
                                },
                            },
                        },
                        user_domain_set: { $addToSet: "$user_domain" },
                    },
                },
                5: {
                    $addFields: {
                        user_domain: { $arrayElemAt: ["$user_domain_set", 0] },
                    },
                },
                6: { $project: { user_domain_set: 0 } },
            },
        },
        req
    );

    return res.status(200).json({ productsCount: productsCount });
};
