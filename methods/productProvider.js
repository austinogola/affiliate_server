var ProductAdvertisingAPIv1 = require('paapi5-nodejs-sdk');
require('dotenv').config()

var defaultClient = ProductAdvertisingAPIv1.ApiClient.instance;

defaultClient.accessKey = process.env.paapi5AccessKey
defaultClient.secretKey = process.env.paapi5SecretKey

defaultClient.host = 'webservices.amazon.com';
defaultClient.region = 'us-east-1';

var api = new ProductAdvertisingAPIv1.DefaultApi();

var ItemInfoRequest = new ProductAdvertisingAPIv1.GetItemsRequest();

ItemInfoRequest['PartnerTag'] = 'ekinazkay-20';
ItemInfoRequest['PartnerType'] = 'Associates';

// ItemInfoRequest['ItemIds'] = ['B085W5TPLN'];

ItemInfoRequest['Resources']=['ItemInfo.Title','Offers.Listings.Price']

const getProductInfo=(productAsins)=>{
    return new Promise((resolve, reject) => {
        ItemInfoRequest['ItemIds'] = productAsins;

        let item

        var callback = async function (error, data, response) {
            if(error) {
                resolve (error.message);
            }else{
             
              var searchItemsResponse = ProductAdvertisingAPIv1.GetItemsResponse.constructFromObject(data);
              let info=JSON.stringify(searchItemsResponse, null, 1)
              resolve(info);
            }
          }
          
        api.getItems(ItemInfoRequest, callback);

        //   resolve(item);
    })
}

module.exports =getProductInfo