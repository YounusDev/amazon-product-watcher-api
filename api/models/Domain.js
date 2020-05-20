module.exports = {
    tableName: 'domains',

    attributes: {
        url: {
            type    : 'string'
        }
    },
    
    domainCollection() {
        return Domain.getDatastore().manager.collection(Domain.tableName);
    },
    
    domainAggregated: async function (opts) {
        let domains_collection = Domain.getDatastore().manager.collection(Domain.tableName);
        
        let domains = await domains_collection.aggregate(opts)
            .toArray();
        
        return domains[0];
    },

    withMeta: async function (opts) {
        let domain = await Domain.findOne(opts);

        if (!domain) return null;

        domain.meta = await DomainMeta.findOne({domain_id: domain.id});

        return domain;
    }
};
