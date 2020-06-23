module.exports = {
    tableName: 'services_logs',

    attributes: {
        serviceType: {
            type: 'string',
            columnName: 'service_type'
        },
        childServiceType: {
            type: 'string',
            columnName: 'child_service_type'
        },
        status: {
            type: 'string'
        }
    },

    serviceLogCollection() {
        return ServiceLog.getDatastore().manager.collection(ServiecLog.tableName);
    },

    serviceLogAggregated: async function (opts) {
        let service_log_collection = ServiceLog.getDatastore().manager.collection(ServiceLog.tableName);

        let service_logs = await service_log_collection.aggregate(opts)
            .toArray();

        return service_logs[0];
    }
};
