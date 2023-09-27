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

const creditSchema = new mongoose.Schema({
    creditId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Credit', 
        required: true
    }
  });


  

const AccountSchema=new mongoose.Schema({  
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
     }, 
    creditHistory:{
        type: [creditSchema],
        default: []
    },
    amazonId:{type:String,required:true},
    totalCredits:{type:Number,default:0}
    
})

const Account=mongoose.model('Account',AccountSchema)

module.exports=Account