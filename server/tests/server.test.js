const expect = require('expect');
const request = require('supertest');
const ObjectID= require('mongodb').ObjectID

const {app}= require('./../server');

const {Todo}= require('./../models/Todos');

let todos= [
    {   _id:new ObjectID(),
        text:"This is the first test todo"
    },
    {   _id:new ObjectID(),
        text:"This is the second test todo"
    }
]

beforeEach((done)=>{
    Todo.remove({})
     .then(()=>{
         return Todo.insertMany(todos)

     }).then((res)=>done())
});



describe('POST /todos',()=>{
    it('should create a new todos',(done)=>{
    let text = `This is a text task`
    request(app)
     .post('/todos')
     .send({text})
     .expect(200)
     .expect((res)=>{
         expect(res.body.text).toBe(text)
     })
     .end((err,res)=>{
         if(err){
            return done(err)
         }
         Todo.find({text})
            .then((todos)=>{
                expect(todos.length).toBe(1)
                expect(todos[0].text).toBe(text)
                done()
            }).catch(e=>done(e))
     })
    })

    it('should not add new todo',(done)=>{
        request(app)
         .post('/todos')
         .send({})
         .expect(400)
         .end((err,res)=>{
             if(err){
                 return done(err)
             }
             Todo.find()
              .then((todos)=>{
                  expect(todos.length).toBe(2)
                  done()
              }).catch(e=>done(e))
         })
    })
})

describe('GET /todos',()=>{
    it('should return the values',(done)=>{
        request(app)
         .get('/todos')
         .expect(200)
         .expect((res)=>{
             expect(res.body.todos.length).toBe(2)
         })
         .end(done)
    })
})

describe('GET /todos/:id',()=>{
    it('should return a todo doc',(done)=>{
        request(app)
         .get(`/todos/${todos[0]._id.toHexString()}`)
         .expect(200)
         .expect((res)=>{
             expect(res.body.todos.text).toBe(todos[0].text);
         })
        .end(done);
    });
    it('should return a 404 if no such item exists',(done)=>{
        let wrongId=new ObjectID()
        request(app)
         .get(`/todos/${wrongId.toHexString()}`)
         .expect(404)
         .expect((res=>{
             expect(res.body.error).toBe('No such item')
         }))
         .end(done)
    })
    it('should return 404 for invalid id',(done)=>{
        request(app)
         .get('/todos/1234')
         .expect(404)
         .end(done)
    })
});

