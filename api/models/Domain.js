module.exports = {
    tableName: 'domains',

    attributes: {
        url: {
            type    : 'string'
        }
    },

    withMeta: async function (opts) {
        let domain = await Domain.findOne(opts);

        if (!domain) return null;

        domain.meta = await DomainMeta.findOne({domain_id: domain.id});

        return domain;
    }
};
