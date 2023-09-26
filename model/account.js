const mongoose=require('mongoose')
const { randomUUID } = require('crypto');
const Credit = require('./credit')

// const buyHistorySchema = new mongoose.Schema({
//     id:{type:String,default:''},
//     normalLink:{type:String,default:''},
//     afLink:{type:String,default:''},
//     activity:{
//         boughtTimes:{type:Number,default:0},
//         buyHistory:[]
//     }
//   });

const productSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true
    },
    name:{type:String,default:''},
    normalLink:{type:String,default:''},
    afLink:{type:String,default:''},
    purchased:{type:Number,default:0},
    dateAdded:{type:Number,required:true}
  });

  const purchaseSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    valid:{
        type:Number,
        required: true
    },
    value:{
        price:{type:Number},
        currency:{type:String}
    },
    creditAmount:{type:Number,required: true}
  });

const AccountSchema=new mongoose.Schema({
    amazonId:{
        type:String,
        required:true
    },  
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
     }, 
    products: {
        type: [productSchema],
        default: []
    },
    purchases:{
        type: [purchaseSchema],
        default: []
    }, 
    credits:{type:Number,default:0}
    
})

const Account=mongoose.model('Account',AccountSchema)

module.exports=Account