module.exports = async function (req, res) {
    if (!await checkOwner(req, res)) return res.status(404).json({message: 'invalid affiliate_id'});
    
    let productId = req.param('id');
    let affiliateId = req.query.affiliate_id;
    
    let productsInPages = await dbHelpers.get(
        AmazonProductInPage.amazonProductsInPagesAggregated,
        {
            bothStageQuery: {
                0: {
                    $match: {
                        product_id: productId,
                        affiliate_id: affiliateId
                    }
                },
                3: {
                    $lookup: {
                        from    : 'pages',
                        let     : {page_id: '$page_id'},
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [
                                            '$$page_id',
                                            {$toString: '$_id'}
                                        ]
                                    }
                                },
                            }
                        ],
                        as      : 'page',
                    }
                },
                4: {
                    $unwind: '$page'
                }
            }
        },
        req
    );
    
    // let amazonProductInPage = await AmazonProductInPage.find({
    //     amazonProductId: id,
    //     affiliateId    : affiliateId
    // });
    //
    // if (!amazonProductInPage.length) {
    //     return res.status(404).json({message: 'invalid id or affiliate_id'});
    // }
    //
    // // return only count of product in pages
    // if (onlyTotal) {
    //     return res.status(200).json({count: amazonProductInPage.length});
    // }
    //
    // //get pageIds array
    // let pageIds = [];
    //
    // Object.keys(amazonProductInPage).forEach(objKey => {
    //     let item = amazonProductInPage[objKey];
    //     pageIds.push(item.pageId);
    // });
    //
    // let pages = await Page.find({
    //     id: pageIds,
    // });
    //
    // let pageUrl = [];
    //
    // Object.keys(pages).forEach(objKey => {
    //     let item = pages[objKey];
    //     pageUrl.push({
    //         pageUrl    : item.url,
    //         lastUpdated: item.nextUpdateAt
    //     });
    // });
    
    return res.status(200).json({productsInPages: productsInPages});
};


//check owner of product
async function checkOwner(req, res) {
    let affiliateId = '';
    
    if (_.has(req.query, 'affiliate_id')) {
        affiliateId = req.query.affiliate_id;
    } else {
        return false;
    }
    
    let userDomain = await dbHelpers.getSingle(
        UserDomain.userDomainAggregated,
        [
            {
                $match: {
                    $expr: {
                        $and: [
                            {
                                $eq: [
                                    '$user_id',
                                    req.me.id
                                ]
                            },
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
                                    affiliateId,
                                    '$domain_use_for.amazon_product_check_service.affiliate_ids',
                                ]
                            }
                        ]
                    }
                }
            }
        ]
    );
    
    return !!userDomain;
}
