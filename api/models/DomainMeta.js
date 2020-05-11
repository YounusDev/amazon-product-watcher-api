module.exports = {
    tableName: 'domains_meta',

    attributes: {
        domainId  : {
            model   : 'domain',
            columnName: 'domain_id'
        },
        domainInfo: {
            type    : 'json',
            columnName: 'domain_info'
        }
    }
};
