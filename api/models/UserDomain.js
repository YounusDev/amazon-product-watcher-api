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
    ],

    withDomain: async function (opts) {
        let userDomains = await UserDomain.find(opts);

        if (!userDomains) {
            return null;
        }

        userDomains = Promise.all(userDomains.map(async userDomain => {

            userDomain.domain = await Domain.withMeta({id: userDomain.domainId });

            return userDomain;
        }));

        return userDomains;
    }
};
