const {MongoClient,ObjectID}= require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp',(err,db)=>{
    if(err){
        return console.log(`Did not connect to the server`)
    }
    console.log(`Connected to the server`);

    // db.collection('Todos').deleteMany({text:'Eat lunch'})
    //     .then((result)=>{
    //         console.log(result)
    //     })
    // db.collection('Todos').deleteOne({text:'Eat lunch'})
    //     .then((result)=>{
    //         console.log(result)
    //     })

    // db.collection('Todos').findOneAndDelete({completed:true})
    //     .then((result)=>{
    //         console.log(result)
    //     })

    // db.collection('Users').deleteMany({name:'jen Doe'})
    //     .then((result)=>{
    //         console.log(result)
    //     })

    db.collection('Users').findOneAndDelete({
        _id:new ObjectID("5c519debb3006055aae48815")
    })
        .then((res)=>{
            console.log(res)
        })

})