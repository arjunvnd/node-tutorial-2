const express = require('express');
const bodyParser= require('body-parser');
const mongoose= require('mongoose');

const app = express();
app.use(bodyParser.json())
mongoose.Promise=global.Promise
mongoose.connect('mongodb://localhost:27017/myTest')
var UserSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    address:[{
        road:{
            type:String,
            required:true
        },
        home:{
            type:String,
            required:true
        }
    }]

})
const User=mongoose.model('User',UserSchema)

app.post('/api',(req,res)=>{
    let email = req.body.email; 
    let user = new User({
        email:email
    })
    user.save()
     .then(docs=>{
         res.send(docs)
     })

     .catch(e=>res.status(400).send(e))
    let road=Math.random().toString()
    let home=(Math.random()*10).toString()
    user.address.push({road,home})
    user.save()
     
})
app.listen(3000,()=>{console.log(`Server started on posrt 3000`)})