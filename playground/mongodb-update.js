const {MongoClient,ObjectID}= require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp',(err,db)=>{
    if(err){
        return console.log(err)
    }
    console.log(`Connected to server`);

    // db.collection('Todos').findOneAndUpdate({_id:new ObjectID("5c51626c8dc8d236b091cb2d")},{$set:{
    //     completed:false
    // }},{returnOriginal:false})
    //     .then((res)=>{
    //         console.log(res)
    //     })

    db.collection('Users').findOneAndUpdate({_id:new ObjectID("5c519dab1858703638553170")},
    {$inc:{age:1}},
    {returnOrginal:false})
        .then((res)=>{
            console.log(res)
        })
})