module.exports = {
    attributes: {
        domainId: {
            model: 'domain'
        },
        url: {
            type: 'string'
        },
        processingStatus: {
            type: 'string'
        },
        nextUpdateAt: {
            type: 'number', autoCreatedAt: true,
        }
    }
};
