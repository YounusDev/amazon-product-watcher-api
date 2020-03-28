module.exports = {
    attributes: {
        pageId: {
            model: 'page'
        },
        amazonProductId: {
            model: 'amazonProduct'
        },
        affiliateId: {
            type: 'json',
            columnType: 'array'
        },
        /*owner: {
            model: 'amazonProduct'
        }*/
    }
};
