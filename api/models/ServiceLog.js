module.exports = {
    tableName: 'service_logs',

    attributes: {
        userDomainId   : {
            type   : 'string',
            columnName: 'user_domain_id'
        },
        domainId   : {
            type   : 'string',
            columnName: 'domain_id'
        },
        pageId   : {
            type   : 'string',
            columnName: 'page_id'
        },
        url: {
            type: 'string'
        },
        serviceType: {
            type: 'string',
            columnName: 'service_type'
        },
        status: {
            type: 'string',
        },
        issueTime: {
            type: 'string',
            columnName: 'issue_time'
        },
        message: {
            type: 'string'
        },
        seen: {
            type: 'boolean'
        }
    },

    pageAggregated: async function (opts) {

        let service_log_collection = ServiceLog.getDatastore().manager.collection(ServiceLog.tableName);

        let result = await service_log_collection.aggregate(opts)
            .toArray();

        return result[0];
    },
};
