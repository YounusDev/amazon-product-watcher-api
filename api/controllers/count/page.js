module.exports = async function (req, res) {
    let projectsCount = await dbHelpers.getSingle(
        Page.pageAggregated,
        [
            {
                $lookup: {
                    from: 'users_domains',
                    let: { domain_id: '$domain_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$user_id', req.me.id] },
                                        { $eq: ['$$domain_id', '$domain_id'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'user_domain'
                }
            },
            { $unwind: '$user_domain' },
            {
                $lookup: {
                    from: 'pages_meta',
                    let: { page_id: { $toString: '$_id' } },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$$page_id', '$page_id'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'page_meta'
                }
            },
            { $unwind: '$page_meta' }, // keep empty meta if needed
            {
                $group: {
                    _id: null,
                    active_count: {
                        $sum: {
                            $cond: {
                                if: {
                                    $in: [{ $substr: [{ $toString: '$page_meta.page_status' }, 0, 1] }, ['2', '3']]
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
                                            $toString: '$page_meta.page_status'
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

    return res.status(200).json({ projectsCount: projectsCount });
};

