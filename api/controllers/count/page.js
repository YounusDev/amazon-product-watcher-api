module.exports = async function (req, res) {
    let pagesCount = await dbHelpers.get(
        Page.pageAggregated,
        {
            bothStageQuery: {
                0: {
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
                1: { $unwind: '$user_domain' },
                2: {
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
                3: { $unwind: '$page_meta' }, // keep empty meta if needed
                4: {
                    $group: {
                        _id: '$domain_id',
                        available: {
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
                        status_404: {
                            $sum: {
                                $cond: {
                                    if: { $eq: ['$page_meta.page_status', 404] },
                                    then: 1,
                                    else: 0
                                }
                            }
                        },
                        other_error: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $not: [{
                                            $in: [{
                                                $substr: [{
                                                    $toString: '$page_meta.page_status'
                                                }, 0, 1]
                                            }, ['2', '3', '4']]
                                        }]
                                    },
                                    then: 1,
                                    else: 0
                                }
                            }
                        },
                        user_domain_set: { $addToSet: '$user_domain' }
                    }
                },
                5: {
                    $addFields: {
                        user_domain: { $arrayElemAt: ['$user_domain_set', 0] }
                    }
                },
                6: { $project: { user_domain_set: 0 } }
            }
        },
        req
    );

    return res.status(200).json({ pagesCount: pagesCount });
};

