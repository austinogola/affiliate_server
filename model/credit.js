const mongoose=require('mongoose')

const activitySchema = new mongoose.Schema({
    activityType:{ 
        type: String,
        default:'buy'
    },
    cost:{
        price:{type:Number},
        currency:{type:String}
    },
    activityOwner:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    activityCredits:{type:Number, required: true}
  });

const CreditShema=new mongoose.Schema({
        stamp:{
            type: Number,
            required: true
        },
        cost:{type:String, required: true,default:''},
        creditOwner:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true
        },
        productCost:{
            price:{type:Number},
            currency:{type:String}
        },
        productOwner:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true
        },
        value:{
            type:Number,
            required: true

        }
    
})

const Credit=mongoose.model('Credit',CreditShema)

module.exports=Credit