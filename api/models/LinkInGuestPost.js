module.exports = {
    tableName: 'links_in_guest_posts',
    
    attributes: {
        userDomainId: {
            type      : 'string',
            columnName: 'user_domain_id'
        },
        holdingUrl  : {
            type: 'string',
            columnName: 'holding_url'
        },
        guest_post_url   : {
            type: 'string',
            columnName: 'guest_post_url'
        },
        linkInfos    : {
            type      : 'json',
            columnType: 'object',
            columnName: 'link_infos'
        }
    },
    
    linkInGuestPostAggregated: async function (opts) {
        let link_in_guest_post_collection = LinkInGuestPost.getDatastore().manager.collection(LinkInGuestPost.tableName);
        
        let result = await link_in_guest_post_collection.aggregate(opts)
            .toArray();
        
        return result[0];
    }
};

