const mongoose=require('mongoose')

const activitySchema = new mongoose.Schema({
    stamp:{type:Number,required:true},
    activityType:{ 
        type: String,
        default:'buy'
    },
    product:{
        name:{type:String},
        price:{type:Number},
        currency:{type:String}
    },
    creditOwner:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    creditRewarded:{type:Number, required: true},
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
            type: [activitySchema],
            default: []
        }
    
})

const Affiliate=mongoose.model('Affiliate',AffiliateSchema)

module.exports=Affiliate