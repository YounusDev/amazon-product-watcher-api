module.exports = {
    attributes: {
        usersDomainsId: {
            model: 'userDomain'
        },
        url: {
            type: 'string'
        },
        remoteUrl: {
            type: 'string'
        },
        content: {
            type: 'string'
        },
        linkInfo: {
            type: 'json',
            columnType: 'array'
        },
        nextUpdateAt: {
            type: 'number', autoCreatedAt: true
        }
    }
};

