module.exports = {
    tableName: 'users_domains',
    
    attributes: [
        {
            projectName  : {
                type    : 'string',
                required: true
            },
            domainId     : {
                model   : 'domain',
                required: true
            },
            userId       : {
                model   : 'user',
                required: true
            },
            domainUseFor : {
                type    : 'json',
                required: true,
            },
            deactivatedAt: {
                type: 'date'
            }
        }
    ],
    
    withDomainAggregated: async function (opts) {
        let users_domains_collection = UserDomain.getDatastore().manager.collection(UserDomain.tableName);
        
        let userDomains = await users_domains_collection.aggregate(opts)
            .toArray();
        
        if (!userDomains[0].data.length) return null;
        
        userDomains[0].data = await Promise.all(userDomains[0].data.map(async userDomain => {
            userDomain.domain = await Domain.withMeta({
                where: {id: userDomain.domain_id}
            });
            
            return userDomain;
        }));
        
        return userDomains;
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
