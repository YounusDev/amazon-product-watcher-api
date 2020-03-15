module.exports = {
    attributes: [
        {
            projectName: {
                type: 'string',
                required: true
            },
            domainId: {
                model: 'domain',
                required: true
            },
            userId: {
                model: 'user',
                required: true
            },
            domainUseFor: {
                type: 'json',
                required: true,
            },
            deactivatedAt: {
                type: 'date'
            }
        }
    ]
};
