require('./config/config')
const _=require('lodash')
const express= require('express');
const bodyParser= require('body-parser');
const {ObjectID}= require('mongodb')

var {authenticate}= require('./middleware/authenticate')
const {mongoose}= require('./db/mongoose');
const {Todo}=require('./models/Todos');
const {Users}=require('./models/users');


const app = express();
const port = process.env.PORT||3000;
app.use(bodyParser.json())


app.post('/todos',(req,res)=>{
    let todo=new Todo({
        text:req.body.text
    })
    todo.save()
     .then((docs)=>{
         res.send(docs)
     },
     (err)=>{
         res.status(400).send(err)
     })
})
app.get('/todos',(req,res)=>{
    Todo.find()
        .then((todos)=>{
            res.send({
                todos:todos
            })
        },(err)=>{
            res.status(400).send(e)
        })
})

app.get('/todos/:id',(req,res)=>{

    let id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send({error:"Invalid id"})
    }
    Todo.findById({
        _id:id
    })
     .then((docs)=>{
         if(!docs){
             return res.status(404).send({error:'No such item'})
         }
         res.status(200).send({
             todos:docs
         })
     })
     .catch(e=>res.status(400))
     
})

app.delete('/todos/:id',(req,res)=>{
    let id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send()
    }

    Todo.findByIdAndRemove(id)
     .then((docs)=>{
         if(!docs){
             return res.status(404).send()
         }
         res.send({
             todos:docs
         })
     })
     .catch(e=>res.status(400).send())

})

app.patch('/todos/:id',(req,res)=>{
    let id=req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send()
    }
    let body=_.pick(req.body,['text','completed']);


    if(_.isBoolean(body.completed)&&body.completed===true){
        body.completedAt=new Date().getTime();
    }else{
        body.completed=false;
        body.completedAt=null;
    }
 
    Todo.findByIdAndUpdate(id,{$set:body},{new:true})
     .then((todos)=>{
         if(!todos){
             return res.status(404).send();
         }

         res.send({todos})
     })
     .catch(e=>res.status(400).send())


})
app.post('/users',(req,res)=>{
    let body=_.pick(req.body,['email','password']);
    let user= new Users(body);
    user.save()
     .then(()=>{
        // res.send(user)
        return user.generateAuthToken()
     })
     .then((token)=>{
         

         res.header("x-auth",token).send(user)
     })
     .catch(e=>{

         res.status(401).send()
        })
})


app.get('/users/me',authenticate,(req,res)=>{
    res.send(req.user)
})

app.post('/users/login',(req,res)=>{
    let body=_.pick(req.body,['email','password'])
    Users.findByCredentials(body.email,body.password)
     .then(user=>{
        return user.generateAuthToken() 
         .then(token=>{
            res.header("x-auth",token).send(user)
         })
        })
     .catch(e=>res.status(400).send())
    
})

app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})

module.exports={app}