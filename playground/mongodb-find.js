const {MongoClient,ObjectID}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp',(err,db)=>{
    if(err){
        return console.log(`Unable to connect to db`)

    }
    console.log(`Connected to mongodb`)

    db.collection('Todos').find({_id:new ObjectID("5c5191cfc835fd542378203c")}).toArray()
        .then((docs)=>{
            console.log(JSON.stringify(docs,undefined,2))
        },err=>console.log(`Cannot fetch data`))

    db.collection('Users').find({name:"jen Doe"}).toArray()
        .then((docs)=>{
            console.log(JSON.stringify(docs,undefined,2))
        }
        ,(err)=>console.log('Something wen wrong'))
})