module.exports = async function (req, res) {

    let affiliateId = req.param('affiliate_id');
    let id = req.param('id');
    let onlyTotal = req.param('only_total');

    await checkOwner(req, res, affiliateId);

    let amazonProductInPage = await AmazonProductInPage.find({
        amazonProductId: id,
        affiliateId: affiliateId
    });

    if (!amazonProductInPage.length) {
        return res.status(404).json({message: 'invalid id or affiliate_id'});
    }

    // return only count of product in pages
    if (onlyTotal) {
        return res.status(200).json({count: amazonProductInPage.length});
    }

    //get pageIds array
    let pageIds = [];

    Object.keys(amazonProductInPage).forEach(objKey => {
        let item = amazonProductInPage[objKey];
        pageIds.push(item.pageId);
    });

    let pages = await Page.find({
        id: pageIds,
    });

    let pageUrl = [];

    Object.keys(pages).forEach(objKey => {
        let item = pages[objKey];
        pageUrl.push({
            pageUrl: item.url,
            lastUpdated: item.nextUpdateAt
        });
    });

    return res.status(200).json(pageUrl);
};


//check owner of product
async function checkOwner(req, res, affiliateId) {

    let userDomains = await UserDomain.find({
        userId: req.me.id
    });

    if (!userDomains) {
        return res.status(404).json({message: 'invalid affiliate_id'});
    }

    let affiliateIds = [];

    //make array of affiliate_ids
    Object.keys(userDomains).forEach(objKey => {
        let item = userDomains[objKey];
        affiliateIds = affiliateIds.concat(item.domainUseFor.amazonProductCheck.affiliateIds);
    });

    if (affiliateIds.indexOf(affiliateId) < 0) {
        return res.status(404).json({message: 'invalid affiliate_id'});
    }
}
