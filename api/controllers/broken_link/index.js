module.exports = async function (req, res) {

    let projectId = req.param('project_id');

    let pages = await Page.find({
        domainId: projectId
    });

    if (!pages) {
        return res.status(404).json({message: 'invalid project id'});
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
            updatedAt: page.createdAt,
            status: pageMeta.pageStatus
        });
    });

    return res.status(200).json(brokenLinkInfo);
};
