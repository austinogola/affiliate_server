const User=require('../model/user')

const addToUsers=async(userDetails)=>{
    return new Promise((resolve, reject) => {
        try {
            let use=new User(userDetails)
            use.save().then(async user=>{
                resolve(user);
            })
            
        } catch (error) {
            resolve(error.message)
        }
        
    })
    
}

const deleteUser = async (userId) => {
    return new Promise((resolve, reject) => {
      try {
        User.findByIdAndDelete(userId, (err, user) => {
          if (err) {
            reject(err.message);
          } else {
            resolve(user);
          }
        });
      } catch (error) {
        reject(error.message);
      }
    });
  };
  

const getUserByEmail=async(email)=>{
    return new Promise(async(resolve, reject) => {
        const userOwner=await User.findOne({email:email})
        if(userOwner) {
            resolve(userOwner)
        }
        else{
            resolve(false)
        }
    })
    
}
const getUserByAmazon=async(amazon_code)=>{
    return new Promise(async(resolve, reject) => {
        const userOwner=await User.findOne({amazon_code:amazon_code})
        if(userOwner) {
            resolve(userOwner)
        }
        else{
            resolve(false)
        }
    })
    
}

const getUserById=async(id)=>{
  return new Promise(async(resolve, reject) => {
      const userOwner=await User.findOne({_id:id})
      if(userOwner) {
          resolve(userOwner)
      }
      else{
          resolve(false)
      }
  })
  
}






module.exports={addToUsers,getUserByEmail,getUserByAmazon,deleteUser,getUserById}