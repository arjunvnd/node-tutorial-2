const mongoose=require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const _ = require('lodash');
const bcrypt= require('bcryptjs')

var UsersSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        minlength:1,
        trim:true,
        unique:true,
        validate:{
            validator:(value)=>{
                return validator.isEmail(value)
            },
            message:'{VALUE} is not an Email'
        }

    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]
});


UsersSchema.methods.toJSON=function(){
    let user=this;

    let userObject = user.toObject();

    userObject=_.pick(userObject,["_id","email"])
    return userObject
}

UsersSchema.methods.generateAuthToken=function(){
    let user=this;
    
    let access='auth';
    let token=jwt.sign({
        _id:user._id.toHexString()
    },'abc123').toString()

    user.tokens.push({access,token})

    return user.save()
     .then(()=>{
         return token
     })

};

UsersSchema.statics.findByToken=function(token){
    let Users=this;
    let decoded;
    // console.log(token)
    
    try{
        decoded=jwt.verify(token,'abc123')
        // console.log('This is the decoded values',decoded)
    }
    
    catch(e){
        return Promise.reject()
    }
    return Users.findOne({
        '_id':decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    })
}
UsersSchema.pre('save',function(next){
    let user=this;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password=hash;
                next();
            })
        })
    }else{
        next()
    }
})
UsersSchema.statics.findByCredentials=function(email,password){
    let Users=this;
    return Users.findOne({email})
     .then(user=>{
         if(!user){
             return Promise.reject()
         }
         return new Promise((resolve,reject)=>{
             bcrypt.compare(password,user.password,(err,success)=>{
                 if(success){
                    //  console.log(success,user)
                     resolve(user)
                 }
                 
                 else{
                     reject()
                 }
             })
         })
     })

}


var Users= mongoose.model('Users',UsersSchema)



module.exports={Users}