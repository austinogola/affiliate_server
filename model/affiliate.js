const mongoose=require('mongoose')


const creditSchema = new mongoose.Schema({
    creditId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Credit', 
        required: true
    }
  });
  

const AffiliateSchema=new mongoose.Schema({
        code:{type:String,required:true},
        owner:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true
        },
        lastUsed:{
            type:Date,
            default:null
        },
        activity:{
            type: [creditSchema],
            default: []
        }
    
})

const Affiliate=mongoose.model('Affiliate',AffiliateSchema)

module.exports=Affiliate