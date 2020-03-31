module.exports = {
    attributes: {
        url: {
            type: 'string',
        },
        processingStatus: {
            type: 'string'
        },
        nextUpdateAt: {
            type: 'number', autoCreatedAt: true,
        },
        /* amazonProductInPage: {
             model: 'amazonProductInPage'
         }*/
    }
};

