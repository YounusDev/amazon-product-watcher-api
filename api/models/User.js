module.exports = {
    tableName: 'users',

    attributes:
        {
            email: {
                type: 'string'
            },
            password: {
                type: 'string',
                protect: true
            },
            forgotPasswordToken: {
                type: 'string',
                columnName: 'forgot_password_token'
            },
            forgotPasswordTokenExpired: {
                type: 'string',
                columnName: 'forgot_password_token_expired'
            },
            verifyStatus: {
                type: 'number',
                columnName: 'verify_status'
            },
            verifyToken: {
                type: 'string',
                columnName: 'verify_token'
            },
            validated: {
                type: 'string',
                defaultsTo: 'active'
            }
        },

    withMeta: async function (opts) {
        let user = await User.findOne(opts);

        if (!user){
            return null;
        }

        user.meta = await UserMeta.findOne({userId: user.id});

        return user;
    }
};
