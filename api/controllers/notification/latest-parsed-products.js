module.exports = async function (req, res) {
    let latestParsedProducts = await dbHelpers.get(
        AmazonProductInPage.amazonProductsInPagesAggregated,
        {
            bothStageQuery: {
                0: {
                    $match: {
                        $expr: {}
                    }
                },
                1: {
                    $lookup: {
                        from: 'users_domains',
                        let: { user_domain_id: '$user_domain_id' },
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
                                                    { $toString: '$_id' },
                                                    '$$user_domain_id'
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
                3: { $unwind: '$user_domain' },
                4: {
                    $lookup: {
                        from: 'amazon_products',
                        let: { product_id: '$product_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [
                                            '$$product_id',
                                            { $toString: '$_id' }
                                        ]
                                    }
                                },
                            }
                        ],
                        as: 'product',
                    }
                },
                5: {
                    $unwind: '$product'
                },
                6: {
                    $sort: { 'updated_at.last_parsed_at': -1 }
                },
                7: {
                    $limit: 5
                }
            }
        },
        req
    );

    return res.status(200).json({ latestParsedProducts: latestParsedProducts });
};

