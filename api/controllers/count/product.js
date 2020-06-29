module.exports = async function (req, res) {
    let productsCount = await dbHelpers.getSingle(
        AmazonProductInPage.amazonProductsInPagesAggregated,
        [
            {
                $lookup: {
                    from: 'users_domains',
                    let: { user_domain_id: '$user_domain_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$user_id', req.me.id] },
                                        { $eq: ['$$user_domain_id', { $toString: '$_id' }] }
                                    ]
                                }
                            },
                        }
                    ],
                    as: 'user_domain'
                }
            },
            { $unwind: '$user_domain' },
            {
                $lookup: {
                    from: 'amazon_products_meta',
                    let: { amazon_product_id: '$product_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$$amazon_product_id', '$amazon_product_id'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'product_meta'
                }
            },
            { $unwind: '$product_meta' }, // keep empty meta if needed
            {
                $group: {
                    _id: null,
                    active_count: {
                        $sum: {
                            $cond: {
                                if: {
                                    $in: [{
                                        $substr: [{
                                            $toString: '$product_meta.page_status'
                                        }, 0, 1]
                                    }, ['2', '3']]
                                },
                                then: 1,
                                else: 0
                            }
                        }
                    },
                    inactive_count: {
                        $sum: {
                            $cond: {
                                if: {
                                    $in: [{
                                        $substr: [{
                                            $toString: '$product_meta.page_status'
                                        }, 0, 1]
                                    }, ['2', '3']]
                                },
                                then: 0,
                                else: 1
                            }
                        }
                    }
                }
            }
        ],
        req
    );

    return res.status(200).json({ productsCount: productsCount });
};

