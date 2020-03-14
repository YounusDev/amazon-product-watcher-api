module.exports = {
    attributes: [
        {
            firstName: {
                type: 'string',
                required: true
            },
            lastName: {
                type: 'string',
                required: true,
            },
            userId: {
                model: 'user'
            }
        }
    ]
};
