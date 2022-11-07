const { v4: uuidv4 } = require('uuid');
const cors = require('cors')
require('dotenv').config();
const express = require('express');
const { createRecords, paginatedResults, validations, admin, removeObjectWithId } = require('./data');
const app = express();
const { faker } = require('@faker-js/faker');


const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors())
 
app.listen(PORT, ()=>{
    console.log(`Server started at https://localhost:${PORT}`);
})

/* --------------- */
      //USER API 
/* --------------- */
const maindata=[];

for(let i=0; i < 20; i++){
        maindata.push(createRecords(i+1))
}  

app.get('/', (req, res)=>{
    return res.status(200).send('server works');
})

//get all users
app.get('/getallusers',async (req,res,next)=>{
    setTimeout(() => {
        try {
          res.status(200).send({
         "total_records": maindata.length,
         "total_pages": 1,
         "page": 1,
         "per_page": maindata.length,
        data: maindata,
  
    })
        } catch (error) {
             next(error);
        }
     
    }, 0);
})

//create user 
app.post('/createuser',(req,res,next)=>{
    let {first_name, id, email, avatar , last_name} = req.body;

    if(!first_name){
        res.status(408).send(
            {
                message: "First name can't be empty"
            }
        )
    }
    else if( !last_name){
        res.status(408).send(
            {
                message: "Last name can't be empty"
            }
        )
    }
    else if( !email){
        res.status(408).send(
            {
                message: "email can't be empty"
            }
        )
    }
 
   

   
   const newavatar = faker.internet.avatar();
    const user = 
        {
        id:id !== undefined ? id: maindata.length + 1,
        first_name: `${first_name}`,
        last_name:` ${last_name}`,
        email: `${email}`,
        avatar: avatar !== undefined? avatar : newavatar,
        //password: faker.internet.password()
        }
    

   try {  
       maindata.push(user)
    res.send({
        newUser: {
            data: maindata,
            status: "sucess"
        },        
        });
   } catch (error) {
        next(error)
   }
})

//update user
app.put('/updateuser/:id',(req,res)=>{
     let userid = req.params.id ;
     const {first_name, email, avatar , password, last_name} = req.body;

     let updateuser = maindata.find(obj => obj.id == userid);
     
    const user = [
    //   updateuser.id = userid,
      {
        id: userid,
        first_name: first_name ?  updateuser.first_name = first_name : updateuser.first_name ,
        last_name: last_name ?  updateuser.last_name = last_name : updateuser.last_name ,
        email: email ?  updateuser.email = email : updateuser.email ,
        avatar: avatar ?  updateuser.avatar = avatar : updateuser.avatar ,
        password: password ?  updateuser.password = password : updateuser.password
      }      
    ]

     res.send({
          data: user,
          sucess: true
     })
})

//get user paginated
app.get('/getallusers/paginate', paginatedResults(maindata), (req, res) => {
    setTimeout(() => {
        res.json(res.paginatedResults);
    }, 3000);
});

//get user by id
app.get('/getuser/:id', (req, res) => {
    userid = req.body.id ?
       maindata.find( obj => obj.id == req.params.id )
       : "ID NOT FOUND";
   res.send(userid);
});

// delete specific user
app.delete(`/removeuser/:id`, (req,res)=>{
    userid = req.params.id ;
     let remomveitem = maindata.find(obj => obj.id == userid);
    removeObjectWithId(maindata,remomveitem.id)
     res.send({
        status: true,
        data:maindata
     })
})

// delete all users
app.delete(`/removeallusers`, (req,res)=>{
   maindata.splice(0,maindata.length)
     res.send({
        "total_records": maindata.length,
         "total_pages": 1,
         "page": 1,
         "per_page": maindata.length,
        data: maindata
     })
})

/* --------------- */
      //Login API 
/* --------------- */

//use getalluser api to get user email n password for Login
app.post('/login',validations(maindata), (req, res)=>{
    res.json(res.validations)
})

//email = admin123@gmail  , password = admin123  use this data to login and get some dummy user data
app.post('/admin',admin(), (req, res)=>{
    res.json(res.admint)
})