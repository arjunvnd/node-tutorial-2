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
         res.status(404).send(err)
     })
})



app.listen(3000,()=>{
    console.log(`Listening on port 3000`)
})

module.exports={app}