module.exports = {
    tableName: 'pages',

    attributes: {
        domainId: {
            type: 'string',
            columnName: 'domain_id'
        },
        url: {
            type: 'string'
        },
        processingStatus: {
            type: 'string',
            columnName: 'processing_status'
        },
        nextUpdateAt: {
            type: 'string',
            columnName: 'next_update_at'
        }
    },

    pageAggregated: async function (opts) {

        let pages_collection = Page.getDatastore().manager.collection(Page.tableName);

        let pages = await pages_collection.aggregate(opts)
            .toArray();

        return pages[0];
    },
};
