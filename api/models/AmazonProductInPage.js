module.exports = {
    tableName: 'amazon_products_in_pages',
    
    attributes: {
        pageId: {
            type: 'string',
            columnName: 'page_id'
        },
        productId: {
            type: 'string'
        },
        affiliateId: {
            type: 'string',
            columnName: 'affiliate_id'
        }
    },
    
    amazon_productsAggregated: async function (opts) {
        
        let amazon_products_collection = AmazonProductInPage.getDatastore().manager.collection(AmazonProductInPage.tableName);
        
        let products = await amazon_products_collection.aggregate(opts)
            .toArray();
        
        return products[0];
    }
};
