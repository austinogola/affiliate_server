const mongoose=require('mongoose')


const CreditShema=new mongoose.Schema({
        stamp:{
            type: Number,
            required: true
        },
        creditOwner:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true
        },
        benefactor:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true
        },
        benefactorCode:{
            type:String,
            required:true
        },
        product:{
            name:{type:String},
            price:{type:Number},
            currency:{type:String}
        },
        value:{type:Number,required: true}
    
})

const Credit=mongoose.model('Credit',CreditShema)



module.exports=Credit