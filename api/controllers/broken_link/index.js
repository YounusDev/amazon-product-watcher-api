module.exports = async function (req, res) {

    let projectId = req.param('project_id');

    let userDomain = await UserDomain.findOne({
        id: projectId,
        userId: req.me.id
    });

    if (!userDomain) {
        return res.status(404).json({message: 'invalid project id'});
    }

    // use db helpers get func only for normal find. nor findOne. only find support given
    let pagesResult = await dbHelpers.get(
        Page.pageAggregated,
        {
            where: {domainId: userDomain.domainId},
            // lookup: {
            //     from: 'pages_meta',
            //     let: {id: '$_id'},
            //     pipeline: [
            //         {
            //             $match: {
            //                 $expr: {
            //                     $and: {
            //                         $eq: [{$toString: '$$id'}, '$page_id']
            //                     }
            //                 }
            //             }
            //         }
            //     ],
            //     as: 'meta'
            // }
        },
        req
    );

    let pages = pagesResult.data;

    if (!pages) {
        return res.status(200).json('broken links not found');
    }

    await Promise.all(Object.keys(pages).map(async (objKey) => {
        page = pages[objKey];

        let pageMeta = await PageMeta.find({
            pageId: page['id']
        });

        page.meta = pageMeta;

        return page;
    }));

    return res.status(200).json(pagesResult);
};
