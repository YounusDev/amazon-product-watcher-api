module.exports = async function (req, res) {

    let projectId = req.param('project_id');

    let userDomain = await UserDomain.findOne({
        id: projectId,
        userId: req.me.id
    });

    if (!userDomain) {
        return res.status(404).json({message: 'invalid project id'});
    }

    let pages = await Page.find({
        domainId: userDomain.domainId
    });

    if (!pages) {
        return res.status(200).json('broken links not found');
    }

    //get pageIds array
    let pageIds = [];

    Object.keys(pages).forEach(objKey => {
        let item = pages[objKey];
        pageIds.push(item.id);
    });

    let pagesMetas = await PageMeta.find({
        pageId: pageIds,
    });

    let brokenLinkInfo = [];

    Object.keys(pages).forEach(objKey => {

        let page = pages[objKey];

        let pageMeta = pagesMetas.find(pagesMeta => pagesMeta.pageId === page.id);

        brokenLinkInfo.push({
            pageId : page.id,
            url: page.url,
            lastUpdated: page.nextUpdateAt,
            status: pageMeta.pageStatus
        });
    });

    return res.status(200).json(brokenLinkInfo);
};
