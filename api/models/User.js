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
    ],

    withMeta: async function (opts) {
        let user = await User.findOne(opts);

        if (!user){
            return null;
        }

        user.meta = await UserMeta.findOne({userId: user.id});

        return user;
    }
};
