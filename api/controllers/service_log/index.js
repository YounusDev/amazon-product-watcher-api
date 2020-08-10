module.exports = async function (req, res) {
    // use db helpers get func only for normal find. nor findOne. only find support given
    let serviceLogResult = await dbHelpers.get(
        ServiceLog.pageAggregated,
        {
            where: { domain_id: userDomain.domainId },
            lookup: {
                from: "service_logs",
                let: { id: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: [{ $toString: "$$id" }, "$page_id"],
                            },
                        },
                    },
                ],
                as: "service_logs",
            },
        },
        req
    );

    return res.status(200).json({ serviceLogs: serviceLogResult });
};
