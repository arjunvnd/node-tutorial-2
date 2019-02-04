const express= require('express');
const bodyParser= require('body-parser');
const {ObjectID}= require('mongodb')


const {mongoose}= require('./db/mongoose');
const {Todo}=require('./models/Todos');
const {Users}=require('./models/users');

const app = express();
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


app.listen(3000,()=>{
    console.log(`Listening on port 3000`)
})

module.exports={app}