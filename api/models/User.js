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
