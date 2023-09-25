const Product=require('../model/product')
const User=require('../model/user')

const addProduct=async(productDetails)=>{
    return new Promise((resolve, reject) => {
        try {
            let acc=new Product(productDetails)
            acc.save().then(product=>{
                resolve(product)
            })
            
        } catch (error) {
            resolve(error.message)
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




module.exports={addProduct,checkExisting,getProducts}