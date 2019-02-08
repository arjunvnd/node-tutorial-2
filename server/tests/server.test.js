
const expect = require('expect');
const request = require('supertest');
const ObjectID= require('mongodb').ObjectID

const {app}= require('./../server');

const {Todo}= require('./../models/Todos');
const{Users}=require('./../models/users')

const{todos,populateTodos,populateUsers,users}=require('./seed/seed')



beforeEach(populateTodos);
beforeEach(populateUsers)
    



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

describe('DELETE /todos/:id',()=>{
    it('should delete items',(done)=>{
        let hex_id= todos[1]._id.toHexString();
        
        request(app)
         .delete(`/todos/${hex_id}`)
         .expect(200)
         .expect((res)=>{
             expect(res.body.todos._id).toBe(hex_id);
         })
         .end((err,res)=>{
             if(err){
                 return done(err)
             }
             Todo.findById(hex_id)
              .then(res=>{
                  expect(res).toNotExist()
                  done()
              }).catch(err=>done(err))
         })
    })
    it('should return 404 for invalid id',(done)=>{
        let new_id=new ObjectID().toHexString();
        request(app)
         .delete(`/todos/${new_id}`)
         .expect(404)
         .end(done)
    })
    it('should return 404 for invalid item',(done)=>{
        request(app)
         .delete(`/todos/12345`)
         .expect(404)
         .end(done)
    })
})

describe('PATCH /todos/:id',()=>{
    it('should update the todo',(done)=>{
        let hex_id=todos[0]._id.toHexString();
        let text='New updated text'
        request(app)
         .patch(`/todos/${hex_id}`)
         .send({text:text,completed:true})
         .expect(200)
         .expect(res=>{
             expect(res.body.todos.text).toBe(text)
             expect(res.body.todos.completed).toBe(true)
             expect(res.body.todos.completedAt).toBeA('number')

         })
         .end(done)
    })
    it('should clear completed at when complete is false',(done)=>{
        let hex_id=todos[1]._id.toHexString();
        let text = 'New things from the false thing'
        request(app)
         .patch(`/todos/${hex_id}`)
         .send({text,completed:false})
         .expect(200)
         .expect(res=>{
            expect(res.body.todos.text).toBe(text)
            expect(res.body.todos.completed).toBe(false)
            expect(res.body.todos.completedAt).toNotExist()

         })
         .end(done)
    })
})

describe('GET /users/me',()=>{
    it('should return user if authenticated',(done)=>{
        request(app)
         .get('/users/me')
         .set('x-auth',users[0].tokens[0].token)
         .expect(200)
         .expect((res)=>{
             expect(res.body._id).toBe(users[0]._id.toHexString())
             expect(res.body.email).toBe(users[0].email)
         })
         .end(done)
    });
    it('should return 401 if not authenticated',(done)=>{
        request(app)
         .get('/users/me')
         .expect(401)
         .expect((res)=>{
             expect(res.body).toEqual({})
         })
         .end(done)
    })
})

describe('POST /users',()=>{
    it('should create a user',(done)=>{
        let email = `someone@example.com`;
        let password= 'abc123!';

        request(app)
         .post('/users')
         .send({email,password})
         .expect(200)
         .expect(res=>{
             expect(res.header['x-auth']).toExist()
             expect(res.body.email).toBe(email)
             expect(res.body._id).toExist()
         })
         .end((err)=>{
             if(err){
                 return done(err)
             }
             Users.findOne({email})
              .then(user=>{
                  expect(user.email).toBe(email)
                  expect(user.password).toNotBe(password)
                  done()
              })
         })  
    })
    it('should return validation error if request is invalid',(done)=>{
        let email='asd0'
        let password='ssasdasdsd'
        request(app)
         .post('/users')
         .send({email,password})
         .expect(401)
         .end(done)
    })
    it('should not create user if email already exists',(done)=>{
        let email='john@example.com'
        let password='sasdasdsd'
        request(app)
        .post('/users')
        .send({email,password})
        .expect(401)
        .end(done)

    })
})