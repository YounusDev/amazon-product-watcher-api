module.exports = async function (req, res) {
    let projectId = req.param('project_id');
    let searchExpr = req.param('s');
    let filterExpr = req.param('f');

    let userDomain = await UserDomain.findOne({
        id: projectId,
        userId: req.me.id
    });

    if (!userDomain) {
        return res.status(404).json({ message: 'invalid project id' });
    }

    let queryPipelineAndExpr = [
        { $eq: ['$domain_id', userDomain.domainId] }
    ];

    let metaPipelineAndExpr = [
        {
            $eq: [
                { $toString: '$$id' },
                '$page_id'
            ]
        }
    ];

    let pageMetaUnwind = {
        path: '$meta',
        preserveNullAndEmptyArrays: true
    };

    if (searchExpr) {
        queryPipelineAndExpr.push({ $regexFind: { input: '$url', regex: searchExpr, options: 'i' } });
    }

    if (filterExpr && ['available', '404', 'other'].includes(filterExpr)) {
        if (filterExpr === 'available') {
            metaPipelineAndExpr.push({
                $in: [{
                    $substr: [{
                        $toString: '$page_status'
                    }, 0, 1]
                }, ['2', '3']]
            });
        } else if (filterExpr === '404') {
            metaPipelineAndExpr.push({
                $in: [{
                    $substr: [{
                        $toString: '$page_status'
                    }, 0, 1]
                }, ['4']]
            });
        } else {
            metaPipelineAndExpr.push({
                $not: [{
                    $in: [{
                        $substr: [{
                            $toString: '$page_status'
                        }, 0, 1]
                    }, ['2', '3', '4']]
                }]
            });
        }

        if (pageMetaUnwind.hasOwnProperty('preserveNullAndEmptyArrays')) {
            delete pageMetaUnwind.preserveNullAndEmptyArrays;
        }
    }

    let query = {
        0: { $match: { $expr: { $and: queryPipelineAndExpr } } },
        1: {
            $lookup: {
                from: 'pages_meta',
                let: { id: '$_id' },
                pipeline: [{ $match: { $expr: { $and: metaPipelineAndExpr } } }],
                as: 'meta'
            }
        },
        2: {
            $unwind: pageMetaUnwind
        },
        3: {
            $project: {
                'meta.compressed_content': 0,
                'meta.lhr_desktop_result': 0,
                'meta.lhr_mobile_result': 0,
            }
        }
    };

    // use db helpers get func only for normal find. nor findOne. only find support given
    let pagesResult = await dbHelpers.get(
        Page.pageAggregated,
        { bothStageQuery: query },
        req
    );

    return res.status(200).json({ brokenLinks: pagesResult });
};
