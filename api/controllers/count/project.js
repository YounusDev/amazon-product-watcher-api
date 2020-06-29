module.exports = async function (req, res) {
    let projectsCount = await dbHelpers.getSingle(
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
                            }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    active_count: {
                        $sum: {
                            $cond: {
                                if: {
                                    $eq: ['$deactivated_at', '']
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
                                    $eq: ['$deactivated_at', '']
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