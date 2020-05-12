module.exports = {
    tableName: 'users_domains',

    attributes: {
        projectName  : {
            type    : 'string',
            columnName: 'project_name'
        },
        domainId     : {
            type   : 'string',
            columnName: 'domain_id'
        },
        userId       : {
            type   : 'string',
            columnName: 'user_id'
        },
        domainUseFor : {
            type    : 'json',
            columnName: 'domain_use_for'
        },
        deactivatedAt: {
            type: 'string',
            columnName: 'deactivated_at'
        }
    },

    withDomainAggregated: async function (opts) {

        let users_domains_collection = UserDomain.getDatastore().manager.collection(UserDomain.tableName);

        let userDomains = await users_domains_collection.aggregate(opts)
            .toArray();

        userDomains[0].data = await Promise.all(userDomains[0].data.map(async userDomain => {
            userDomain.domain = await Domain.withMeta({
                where: {id: userDomain.domain_id}
            });

            return userDomain;
        }));

        return userDomains[0];
    },

    withDomain: async function (opts) {
        let userDomains = await UserDomain.find(opts);

        if (!userDomains) {
            return null;
        }

        userDomains = Promise.all(userDomains.map(async userDomain => {

            userDomain.domain = await Domain.withMeta({id: userDomain.domainId});

            return userDomain;
        }));

        return userDomains;
    }
};
