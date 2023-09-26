const Product=require('../model/product')
const User=require('../model/user')
const AccountHandler=require('./accounts')


const checkProductLink=(link)=>{
    return new Promise(async(resolve, reject) => {
        try {
            const productExists=await Product.find({normalLink: link})
            if(productExists && productExists[0]){
                const {normalLink,afLink,_id} = productExists[0]
                // let theWinner=await determineBestRank(productExists)
                resolve({final:{present:true,normalLink,afLink,id:_id}})

            }
            else{
                resolve({none:null})
            }
            
        } catch (error) {
            resolve(error.message)
        }
        
    })
}

const checkHref=(string)=>{
    return new Promise((resolve, reject)=>{
        const hrefSubstring = 'href="';

        // Check if the string contains the href substring
        const hrefIndex = string.indexOf(hrefSubstring);
        if (hrefIndex === -1) {
          resolve(string)
          return
        }
        const endQuoteIndex = string.indexOf('"', hrefIndex + hrefSubstring.length);
        if (endQuoteIndex === -1) {
          resolve(string)
          return 
        }
        let finalString=string.substring(hrefIndex + hrefSubstring.length, endQuoteIndex);
      
       
        resolve (finalString)
    })
    
}

const determineBestRank=async()=>{
    return new Promise(async(resolve, reject) => {

    })
}


const addProduct=async(userId,productDetails)=>{
    return new Promise(async(resolve, reject) => {
        if(!userId){
            resolve(false)
        }
        else{
            try {
                const owner=userId
                const dateAdded=new Date().getTime()
                let {name,normalLink,afLink}=productDetails
                afLink=await checkHref(afLink)
                const activity=[]
                let productObject={owner,name,normalLink,afLink,dateAdded,activity}
            
                let prod=new Product(productObject)
                prod.save().then(async product=>{
                    productObject.productId=product._id
                    let final=await AccountHandler.addProductToAccount(userId,productObject)
                    resolve(final)

                })
                
            } catch (error) {
                resolve(error.message)
            }
        }
        
        
    })
    
}

const checkExisting=async(email)=>{
    return new Promise(async(resolve, reject) => {
        const emailExists=await Product.findOne({email})
        if(emailExists) {
            resolve(true)
        }
        else{
            resolve(false)
        }
    })
    
}

const getProducts=async(id)=>{
    return new Promise(async(resolve, reject) => {
        const productOwner=await Product.findOne({_id:id})
        if(accountOwner) {
            resolve(accountOwner)
        }
        else{
            resolve(false)
        }
    })
}




module.exports={addProduct,checkExisting,getProducts,addProduct,checkProductLink}