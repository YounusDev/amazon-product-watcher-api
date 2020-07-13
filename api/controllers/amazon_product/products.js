module.exports = async function (req, res) {
    let usersDomainId = req.param('id');
    let searchExpr = req.param('s');
    let filterExpr = req.param('f');

    let userDomain = await UserDomain.findOne({
        id: usersDomainId,
        userId: req.me.id
    });

    if (!userDomain) {
        return res.status(404).json({ message: 'invalid project id' });
    }

    let metaPipelineAndExpr = [
        {
            $eq: [
                '$$product_id',
                '$amazon_product_id'
            ]
        }
    ];

    let productMetaUnwind = {
        path: '$meta',
        preserveNullAndEmptyArrays: true
    };

    if (searchExpr) {
        metaPipelineAndExpr.push({
            $regexFind: { input: '$metas.product_name', regex: searchExpr, options: 'i' }
        });

        delete productMetaUnwind.preserveNullAndEmptyArrays;
    }

    if (filterExpr && ['available', 'unavailable', '404', 'other'].includes(filterExpr)) {
        if (filterExpr === 'available') {
            metaPipelineAndExpr.push({
                $in: [{
                    $substr: [{
                        $toString: '$page_status'
                    }, 0, 1]
                }, ['2', '3']]
            });
            metaPipelineAndExpr.push(
                {
                    $ne: [
                        { $type: '$metas.in_stock' },
                        'missing'
                    ]
                }
            );
            metaPipelineAndExpr.push(
                {
                    $gt: [
                        {
                            $convert: {
                                input: '$metas.in_stock',
                                to: 'int',
                                onError: 0,
                                onNull: 0
                            }
                        },
                        0
                    ]
                }
            );
        } else if (filterExpr === '404') {
            metaPipelineAndExpr.push({
                $in: [{
                    $substr: [{
                        $toString: '$page_status'
                    }, 0, 1]
                }, ['4']]
            });
        } else if (filterExpr === 'unavailable') {
            metaPipelineAndExpr.push({
                $in: [{
                    $substr: [{
                        $toString: '$page_status'
                    }, 0, 1]
                }, ['2', '3']]
            });
            metaPipelineAndExpr.push(
                {
                    $ne: [
                        { $type: '$metas.in_stock' },
                        'missing'
                    ]
                }
            );
            metaPipelineAndExpr.push(
                {
                    $lt: [
                        {
                            $convert: {
                                input: '$metas.in_stock',
                                to: 'int',
                                onError: 0,
                                onNull: 0
                            }
                        },
                        1
                    ]
                }
            )
        } else {
            metaPipelineAndExpr.push({
                $not: [{
                    $in: [{
                        $substr: [{
                            $toString: '$page_status'
                        }, 0, 1]
                    }, ['2', '3', '4']]
                }]
            });
        }

        if (productMetaUnwind.hasOwnProperty('preserveNullAndEmptyArrays')) {
            delete productMetaUnwind.preserveNullAndEmptyArrays;
        }
    }

    let query = {
        0: {
            $match: {}
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
                                        ],
                                    },
                                    {
                                        $ne: [
                                            { $type: '$domain_use_for.amazon_products_check_service' },
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
                            pipeline: [{ $match: { $expr: { $and: metaPipelineAndExpr } } }],
                            as: 'meta'
                        },
                    },
                    {
                        $unwind: productMetaUnwind
                    }
                ],
                as: 'product',
            }
        },
        5: { $unwind: '$product' },
        6: {
            $project: {
                user_domain: 0,
                'product.meta.compressed_content': 0
            }
        }
    };

    let amazonProducts = await dbHelpers.get(
        AmazonProductInPage.amazonProductsInPagesAggregated,
        { bothStageQuery: query },
        req
    );

    return res.status(200).json({ amazonProducts: amazonProducts });
};

