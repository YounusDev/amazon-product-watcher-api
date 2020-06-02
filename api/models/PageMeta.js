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
        },
        lhrDesktopResult: {
            type: 'json',
            columnName: 'lhr_desktop_result'
        },
        lhrMobileResult: {
            type: 'json',
            columnName: 'lhr_mobile_result'
        }
    }
};
