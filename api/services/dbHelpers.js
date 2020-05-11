module.exports.get = async function (model, options = {}, req = null, limit = 10) {
    let queryOptions = [];
    let skip = 0;
    let current_page = 1;

    if (req) {
        if (_.has(req.query, 'page')) {
            skip = (parseInt(req.query.page) - 1) * limit;
            current_page = parseInt(req.query.page);
        }
    }

    if (!_.has(options, 'limit')) queryOptions.limit = limit;

    let originalMatchQuery = !_.has(options, 'where') ? _.cloneDeep(options) : _.cloneDeep(options.where);

    let finalMatchQuery = {};

    Object.keys(originalMatchQuery).map(key => {
        finalMatchQuery[_.snakeCase(key)] = originalMatchQuery[key];
    });

    queryOptions = [
        {
            $match: finalMatchQuery
        },
        {
            $facet: {
                data: [
                    {
                        $match: finalMatchQuery
                    },
                    {
                        $skip: skip
                    },
                    {
                        $limit: !_.has(options, 'limit') ? limit : options.limit
                    }
                ],
                total_rows: [
                    {$count: 'count'}
                ]
            }
        },
        {
            $project: {
                data: 1,
                pagination_meta: {
                    total: {
                        $arrayElemAt: [
                            '$total_rows.count',
                            0
                        ]
                    },
                    current_page: {$literal: current_page}
                }
            }
        }
    ];

    let result = await model(queryOptions);

    if (result && _.hasIn(result, 'pagination_meta')) {
        let paginationMeta = result.pagination_meta;

        paginationMeta.last_page = Math.ceil(parseInt(paginationMeta.total) / limit);
    }

    return result;
};
