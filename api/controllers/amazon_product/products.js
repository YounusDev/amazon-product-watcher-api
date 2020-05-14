module.exports = async function (req, res) {
    
    let usersDomainId = req.param('id');
    
    let userDomain = await UserDomain.findOne({
        id    : usersDomainId,
        userId: req.me.id
    });
    
    if (!userDomain) {
        return res.status(404).json({message: 'invalid project id'});
    }
    
    let amazonProducts = await dbHelpers.get(
        AmazonProductInPage.amazonProductsInPagesAggregated,
        {
            bothStageQuery: {
                0: {$match: {}},
                1: {
                    $lookup: {
                        from    : 'users_domains',
                        let     : {affiliate_id: '$affiliate_id'},
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $ne: [
                                                    {
                                                        $type: '$domain_use_for.amazon_product_check_service'
                                                    },
                                                    'missing'
                                                ]
                                            },
                                            {
                                                $in: [
                                                    '$$affiliate_id',
                                                    '$domain_use_for.amazon_product_check_service.affiliate_ids'
                                                ]
                                            }
                                        ]
                                    }
                                }
                            }
                        ],
                        as      : 'user_domain'
                    }
                },
                2: {
                    $match: {
                        $expr: {
                            $gt: [
                                {
                                    $size: '$user_domain'
                                },
                                0
                            ]
                        }
                    }
                    
                },
                3: {
                    $lookup: {
                        from    : 'amazon_products',
                        let     : {product_id: '$product_id'},
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [
                                            '$$product_id',
                                            {$toString: '$_id'}
                                        ]
                                    }
                                },
                            },
                            {
                                $lookup: {
                                    from    : 'amazon_products_meta',
                                    let     : {product_id: {$toString: '$_id'}},
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
                                    as      : 'meta'
                                },
                            },
                            {
                                $unwind: {
                                    path                      : '$meta',
                                    preserveNullAndEmptyArrays: true
                                }
                            }
                        ],
                        as      : 'product',
                    }
                },
                4: {
                    $unwind: '$product'
                },
                5: {
                    $project: {
                        user_domain: 0
                    }
                }
            }
        },
        req
    );
    
    return res.status(200).json({projects: amazonProducts});
};

