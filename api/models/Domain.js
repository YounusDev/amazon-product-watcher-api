module.exports = {
    attributes: [
        {
            url: {
                type: 'string',
                required: true
            },
            status: {
                type: 'string'
            },
            nextUpdateAt: {
                type: 'date'
            }
        }
    ],

    withMeta: async function (opts) {
        let domain = await Domain.findOne(opts);

        if (!domain){
            return null;
        }

        domain.meta = await DomainMeta.findOne({domainId: domain.id});

        return domain;
    }
};
