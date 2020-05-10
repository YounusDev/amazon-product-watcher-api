module.exports = {
    tableName: 'domains_meta',
    
    attributes: [
        {
            domainId  : {
                model   : 'domain',
                type    : 'string',
                required: true
            },
            domainInfo: {
                type    : 'json',
                required: true,
            }
        }
    ]
};
