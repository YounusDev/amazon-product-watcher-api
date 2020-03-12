module.exports = {
    attributes: [
        {
            email: {
                type: 'email',
                required: true
            },
            password: {
                type: 'string',
                required: true,
                protect: true
            },
            validated: {
                type: 'string',
                defaultsTo: 'active'
            }
        }
    ]
};
