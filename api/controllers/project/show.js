module.exports = async function (req, res) {
    let usersProjectId = req.param("id");

    let userProject = await dbHelpers.getSingle(
        UserDomain.userDomainAggregated,
        [
            {
                $match: {
                    $expr: {
                        $and: [
                            {
                                $eq: ["$user_id", req.me.id],
                            },
                            {
                                $eq: [{ $toString: "$_id" }, usersProjectId],
                            },
                        ],
                    },
                },
            },
            {
                $lookup: {
                    from: "domains",
                    let: {
                        domain_id: "$domain_id",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$$domain_id", { $toString: "$_id" }],
                                },
                            },
                        },
                    ],
                    as: "domain",
                },
            },
            {
                $unwind: "$domain",
            },
        ]
    );

    if (!userProject) {
        return res.status(404).json({ message: "invalid project id" });
    }

    return res.status(200).json({
        project: userProject,
    });
};
