const express= require('express');
const bodyParser= require('body-parser');

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


app.listen(3000,()=>{
    console.log(`Listening on port 3000`)
})

module.exports={app}