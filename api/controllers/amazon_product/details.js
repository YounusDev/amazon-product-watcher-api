module.exports = async function (req, res) {

    let domainId = req.param('domain_id');

    let userDomain = await UserDomain.findOne({
        domainId: domainId
    });

    if (!userDomain) {
        return res.json({message: 'invalid domain id'}).status(404);
    }

    let affiliateIds = userDomain.domainUseFor.amazonProductCheck.affiliateIds;

    let amazonProductInPage = await AmazonProductInPage.find({
        affiliateId: affiliateIds
    });

    //get amazonProductIds array
    let amazonProductIds = [];

    Object.keys(amazonProductInPage).forEach(objKey => {
        let item = amazonProductInPage[objKey];
        amazonProductIds.push(item.amazonProductId);
    });

    let amazonProducts = await AmazonProduct.find({
        id: amazonProductIds
    });

    let amazonProductMeta = await AmazonProductMeta.find({
        amazonProductId: amazonProductIds
    });

    let amazonProductInfo = [];

    Object.keys(amazonProducts).forEach((objKey, index) => {

        let amazonProduct = amazonProducts[objKey];

        let amzProductMeta = amazonProductMeta.find(amzProductMeta => amzProductMeta.amazonProductId === amazonProduct.id);

        amazonProductInfo.push({
            id: amazonProduct.id,
            productName: amzProductMeta.metas.productName,
            url: amazonProduct.url,
            status: amzProductMeta.pageStatus,
            lastUpdated: amazonProduct.createdAt,
        });
    });

    return res.json(amazonProductInfo).status(200);
};

