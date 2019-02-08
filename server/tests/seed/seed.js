const {ObjectID}=require('mongodb')
const {Todo}=require('./../../models/Todos');
const {Users}=require('./../../models/users')
const jwt=require('jsonwebtoken')


let todos= [
    {   _id:new ObjectID(),
        text:"This is the first test todo"
    },
    {   _id:new ObjectID(),
        text:"This is the second test todo",
        completed:true,
        completedAt:333
    }
]

let userOneId=new ObjectID();
let userTwoId=new ObjectID()

let users=[
    {
        _id:userOneId,
        email:'john@example.com',
        password:'userOnePass',
        tokens:[
            {
                access:'auth',
                token:jwt.sign({_id:userOneId,access:'auth'},'abc123').toString()
            }
        ]
    },
    {
        _id:userTwoId,
        email:'jen@example.com',
        password:'userTwoPass'

    }
]

function populateTodos(done){
    Todo.remove({})
    .then(()=>{
        return Todo.insertMany(todos)

    }).then((res)=>done())
}

function populateUsers(done){
    Users.remove({})
     .then(()=>{
         let userOne=new Users(users[0]).save()
         let userTwo=new Users(users[1]).save()
         return Promise.all([userOne,userTwo])
          
     }).then(()=>done())
}

module.exports={todos,populateTodos,populateUsers,users}