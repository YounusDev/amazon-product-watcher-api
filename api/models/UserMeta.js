module.exports = {
    tableName: 'users_meta',

    attributes: {
        firstName: {
            type: 'string',
            columnName: 'first_name'
        },
        lastName: {
            type: 'string',
            columnName: 'last_name'
        },
        userId: {
            model: 'user',
            columnName: 'user_id'
        }
    }
};
