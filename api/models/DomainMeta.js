module.exports = {
    attributes: [
        {
            domainId: {
                model: 'domain',
                type: 'number',
                required: true
            },
            domainInfo: {
                type: 'json',
                required: true,
            }
        }
    ]
};
