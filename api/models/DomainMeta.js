module.exports = {
    tableName: 'domains_meta',

    attributes: {
        domainId  : {
            type   : 'string',
            columnName: 'domain_id'
        },
        domainInfo: {
            type    : 'json',
            columnName: 'domain_info'
        }
    }
};
