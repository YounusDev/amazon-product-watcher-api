module.exports.get = async function (model, options = {}, req = null, limit = 1) {
    let queryOptions = [];
    let skip         = 0;
    let current_page = 1;
    
    if (req) {
        if (_.has(req.query, 'page')) {
            skip         = (parseInt(req.query.page) - 1) * limit;
            current_page = parseInt(req.query.page);
        }
    }
    
    if (!_.has(options, 'limit')) queryOptions.limit = limit;
    
    let originalMatchQuery = !_.has(options, 'where') ? _.cloneDeep(options) : _.cloneDeep(options.where);
    let lookupQuery        = !_.has(options, 'lookup') ? null : _.cloneDeep(options.lookup);
    let unwindQuery        = !_.has(options, 'lookup') ? null : _.cloneDeep(options.unwind);
    
    let finalMatchQuery = {};
    
    Object.keys(originalMatchQuery).map(key => {
        finalMatchQuery[_.snakeCase(key)] = originalMatchQuery[key];
    });
    
    queryOptions = [
        {
            $match: finalMatchQuery,
        },
        {
            $facet: {
                data      : [
                    {
                        $match: finalMatchQuery,
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
                data           : 1,
                pagination_meta: {
                    total       : {
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
    
    if (lookupQuery) {
        // push lookup query at 2nd position
        queryOptions[1].$facet.data.splice(1, 0, {$lookup: lookupQuery});
    }
    if (unwindQuery) {
        // push lookup query at 3rd position
        // its now only for getting single single item. dont use unwind if you has more than 1 elm for now
        queryOptions[1].$facet.data.splice(2, 0, {$unwind: unwindQuery});
    }
    
    let result = await model(queryOptions);
    
    result.data.map(obj => {
        if (_.hasIn(obj, '_id')) {
            obj.id = String(obj._id);
            
            delete obj._id;
        }
    });
    
    
    if (result && _.hasIn(result, 'pagination_meta')) {
        let paginationMeta = result.pagination_meta;
        let last_page      = Math.ceil(parseInt(paginationMeta.total) / limit);
        
        paginationMeta.last_page = last_page || 0;
    }
    
    if (result && !_.hasIn(result.pagination_meta, 'total')) result.pagination_meta.total = 0;
    
    return result;
};
