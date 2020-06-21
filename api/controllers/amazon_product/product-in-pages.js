module.exports = async function (req, res) {
    let ownerInfo = checkOwner(req, res);

    if (!(!!ownerInfo)) return res.status(404).json({ message: 'invalid project id' });

    let productId = req.param('id');

    let productsInPages = await dbHelpers.get(
        AmazonProductInPage.amazonProductsInPagesAggregated,
        {
            bothStageQuery: {
                0: {
                    $match: {
                        product_id: productId,
                        user_domain_id: ownerInfo.user_id
                    }
                },
                3: {
                    $lookup: {
                        from: 'pages',
                        let: { page_id: '$page_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [
                                            '$$page_id',
                                            { $toString: '$_id' }
                                        ]
                                    }
                                },
                            }
                        ],
                        as: 'page',
                    }
                },
                4: {
                    $unwind: '$page'
                }
            }
        },
        req
    );

    return res.status(200).json({ productsInPages: productsInPages });
};


//check owner of product
async function checkOwner(req, res) {
    let projectId = req.query.project_id;

    let userDomain = await dbHelpers.getSingle(
        UserDomain.userDomainAggregated,
        [
            {
                $match: {
                    $expr: {
                        $and: [
                            {
                                $eq: [
                                    { $toString: '$_id' },
                                    projectId
                                ]
                            },
                            {
                                $eq: [
                                    '$user_id',
                                    req.me.id
                                ]
                            },
                            {
                                $ne: [
                                    {
                                        $type: '$domain_use_for.amazon_products_check_service'
                                    },
                                    'missing'
                                ]
                            }
                        ]
                    }
                }
            }
        ]
    );

    return userDomain;
}
