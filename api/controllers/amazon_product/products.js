module.exports = async function (req, res) {

    let usersDomainId = req.param('id');

    let userDomain = await UserDomain.findOne({
        id: usersDomainId,
        userId: req.me.id
    });

    if (!userDomain) {
        return res.status(404).json({message: 'invalid project id'});
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

    Object.keys(amazonProducts).forEach(objKey => {

        let amazonProduct = amazonProducts[objKey];

        let amzProductMeta = amazonProductMeta.find(amzProductMeta => amzProductMeta.amazonProductId === amazonProduct.id);

        let amzProductAffiliateId = amazonProductInPage.find(
            amazonProductInPage => amazonProductInPage.amazonProductId === amazonProduct.id
        ).affiliateId;

        amazonProductInfo.push({
            id: amazonProduct.id,
            productName: amzProductMeta.metas.productName,
            url: amazonProduct.url,
            affiliateId: amzProductAffiliateId,
            status: amzProductMeta.pageStatus,
            lastUpdated: amazonProduct.nextUpdateAt
        });
    });

    return res.status(200).json(amazonProductInfo);
};

