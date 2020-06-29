module.exports.get = async function (model, options = {}, req = null, limit = 10) {
    let queryOptions = [];
    let skip = 0;
    let current_page = 1;
    let finalLimit = 10;

    queryOptions.limit = !_.has(options, 'limit') ? limit : options.limit;

    if (req) {
        if (_.has(req.query, 'limit')) {
            queryOptions.limit = parseInt(req.query.limit);
        }

        if (_.has(req.query, 'page')) {
            skip = (parseInt(req.query.page) - 1) * queryOptions.limit;
            current_page = parseInt(req.query.page);
        }
    }

    finalLimit = queryOptions.limit;

    queryOptions = [
        {
            $facet: {
                data: [
                    {
                        $skip: skip
                    },
                    {
                        $limit: queryOptions.limit
                    }
                ],
                total_rows: [
                    { $count: 'count' }
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
                    current_page: { $literal: current_page }
                }
            }
        }
    ];

    if (!_.hasIn(options, 'pageStageQuery') && !_.hasIn(options, 'dataStageQuery') && !_.hasIn(options, 'bothStageQuery')) {
        let originalMatchQuery = !_.has(options, 'where') ? _.cloneDeep(options) : _.cloneDeep(options.where);
        let lookupQuery = !_.has(options, 'lookup') ? null : _.cloneDeep(options.lookup);
        let unwindQuery = !_.has(options, 'lookup') ? null : _.cloneDeep(options.unwind);

        let finalMatchQuery = {};

        Object.keys(originalMatchQuery).map(key => {
            finalMatchQuery[_.snakeCase(key)] = originalMatchQuery[key];
        });

        queryOptions.splice(0, 0, { $match: finalMatchQuery });
        queryOptions[1].$facet.data.splice(0, 0, { $match: finalMatchQuery });

        if (lookupQuery) {
            // push lookup query at 2nd position
            queryOptions[1].$facet.data.splice(1, 0, { $lookup: lookupQuery });
        }
        if (unwindQuery) {
            // push lookup query at 3rd position
            // its now only for getting single single item. dont use unwind if you has more than 1 elm for now
            queryOptions[1].$facet.data.splice(2, 0, { $unwind: unwindQuery });
        }
    } else {
        Object.keys(options.bothStageQuery).map((key, index) => {
            queryOptions.splice(index, 0, options.bothStageQuery[key]);
        });
    }

    // console.log(queryOptions);

    let result = await model(queryOptions);

    result.data.map(obj => {
        if (_.hasIn(obj, '_id')) {
            obj.id = String(obj._id);

            delete obj._id;
        }
    });


    if (result && _.hasIn(result, 'pagination_meta')) {
        let paginationMeta = result.pagination_meta;

        let last_page = Math.ceil(parseInt(paginationMeta.total) / finalLimit);

        paginationMeta.last_page = last_page || 1;
    }

    if (result && !_.hasIn(result.pagination_meta, 'total')) result.pagination_meta.total = 0;

    return result;
};

module.exports.getSingle = async function (model, options = []) {
    // console.log(options);

    let result = await model(options);

    if (!result) return null;

    Object.keys(result).map(key => {
        if (key === '_id') {
            result.id = String(result._id);

            delete result._id;
        }
    });

    return result;
};

