const {ObjectID}=require('mongodb')
const {Todo}=require('./../server/models/Todos');
const {mongoose}= require('./../server/db/mongoose');
const {Users}= require('./../server/models/users');

const id = '6c57184b9db4e41381ba4e0e11';

    // if(!ObjectID.isValid(id))
    // {
    //     console.log(`Invalid id`)
    // }


// Todo.find({
//     _id:id
// })
//     .then((res)=>{
//         console.log(res)
//     },(err)=>{
//         console.log(err)
//     })

// Todo.findOne({
//     _id:id
// })
//     .then((res)=>{
        
//         console.log("Find one",res)
//     },(err)=>{
//         console.log(err)
//     })

// Todo.findById({
//     _id:id
// })
//     .then((res)=>{
//         if(!res) return console.log(`There is no item of given specs`)
//         console.log('The find oone by id',res)
//     }).catch(e=>console.log(e))

Users.find({
    _id:'5c5539760661ef1ede94e248'
})
 .then((res)=>{
     console.log(res)
 })