// const MongoClient=require('mongodb').MongoClient;
const {MongoClient,ObjectID}=require('mongodb')

const id=new ObjectID()
console.log(id)

MongoClient.connect('mongodb://localhost:27017/ToDoApp',(err,db)=>{
    if(err){
        return console.log(`Cannot connect to mongodb server ${err}`)
    }
    console.log(`Connected to mongodb server`)
    // db.collection('Todos').insertOne({
    //     text:"Something to Now",
    //     completed:false
    // },(err,result)=>{
    //     if(err){
    //         return console.log(`Unable to insert todo ${err}`)
    //     }
    //     console.log(JSON.stringify(result.ops))
    //})
    db.collection('Users').insertOne({
        name:'Samantha',
        age:'36',
        location:'Sweden'
    },(err,result)=>{
        if(err){
            return console.log(`Could not insert user to db ${err}`)
        }
        console.log(JSON.stringify(result.ops))
    })
    db.close()
})