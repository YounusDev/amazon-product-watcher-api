module.exports = async function (req, res) {
    let usersDomainId = req.param('id');

    let userDomain = await UserDomain.findOne({
        id: usersDomainId,
        userId: req.me.id
    });

    if (!userDomain) {
        return res.status(404).json({ message: 'invalid project id' });
    }

    let amazonProducts = await dbHelpers.get(
        AmazonProductInPage.amazonProductsInPagesAggregated,
        {
            bothStageQuery: {
                0: { $match: {} },
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
                                                ],
                                            },
                                            {
                                                $ne: [
                                                    {
                                                        $type: '$domain_use_for.amazon_products_check_service'
                                                    },
                                                    'missing'
                                                ]
                                            },
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
                3: { $match: { $expr: { $eq: ['$user_domain_id', usersDomainId] } } },
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
                            },
                            {
                                $lookup: {
                                    from: 'amazon_products_meta',
                                    let: { product_id: { $toString: '$_id' } },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $eq: [
                                                        '$$product_id',
                                                        '$amazon_product_id'
                                                    ]
                                                }
                                            }
                                        }
                                    ],
                                    as: 'meta'
                                },
                            },
                            {
                                $unwind: {
                                    path: '$meta',
                                    preserveNullAndEmptyArrays: true
                                }
                            }
                        ],
                        as: 'product',
                    }
                },
                5: {
                    $unwind: '$product'
                },
                6: {
                    $project: {
                        user_domain: 0,
                        'product.meta.compressed_content': 0
                    }
                }
            }
        },
        req
    );

    return res.status(200).json({ amazonProducts: amazonProducts });
};

