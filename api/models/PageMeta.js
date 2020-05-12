module.exports = {
    tableName: 'pages_meta',

    attributes: {
        pageId: {
            type: 'string',
            columnName: 'page_id'
        },
        content: {
            type: 'string'
        },
        pageStatus: {
            type: 'string',
            columnName: 'page_status'
        }
    }
};
