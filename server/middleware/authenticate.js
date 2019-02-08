const Users=require('./../models/users').Users

var authenticate=(req,res,next)=>{
    let token = req.header('x-auth');
    Users.findByToken(token)
     .then((user)=>{
         if(!user){
            return Promise.reject()
         }
         req.user=user;
         req.token=token;
         next()
     })
     .catch(e=>res.status(401).send())
}

module.exports={
    authenticate
}