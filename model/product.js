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
    activityCredits:{type:Number, required: true},
    activityDate:{type:String, required: true}
  });
  

const ProductSchema=new mongoose.Schema({
        owner:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true
        },
        dateAdded:{type:Number, required: true},
        name:{type:String, required: true,default:''},
        normalLink:{type:String,default:''},
        afLink:{type:String, required: true},
        activity:{
            type: [activitySchema],
            default: []
        },
    
})

const Product=mongoose.model('Product',ProductSchema)

module.exports=Product