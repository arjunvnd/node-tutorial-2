const jwt = require('jsonwebtoken');
const bcrypt= require('bcryptjs')

var password='123abc!'

// bcrypt.genSalt(10,(err,salt)=>{
//     bcrypt.hash(password,salt,(err,hash)=>{
//         console.log(hash)
//     })
// })

var hashedPass='$2a$10$P/2M92OooSeaRgYPAZCjouacb63BdvIhZHROLRJppmd7WPXTDoE4d';
bcrypt.compare(password,hashedPass,(err,success)=>{
    console.log(success)
})
// var data = {
//     id:10
// }

// var token=jwt.sign(data,'123abc');
// console.log(token)
// var decoded= jwt.verify(token,'123abc')
// console.log(decoded)