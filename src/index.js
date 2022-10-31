const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const express = require('express');
const { createRecords, paginatedResults, validations } = require('./data');
const app = express();
const PORT = process.env.NODE_APP_PORT || 8080;

app.use(express.json());

app.listen(PORT, ()=>{
    console.log(`Server started at https://localhost:${PORT}`);
})

/* --------------- */
      //USER API 
/* --------------- */

const users = [];
for(let i=0; i < 20; i++){
        users.push(createRecords())
}  

//get all users
app.get('/getallusers',async (req,res,next)=>{
    setTimeout(() => {
        try {
          res.status(200).send({
         "total_records": users.length,
         "total_pages": 1,
         "page": 1,
         "per_page": users.length,
        data: users,
  
    })
        } catch (error) {
             next(error);
        }
     
    }, 5000);
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
    else if( !avatar){
        res.status(408).send(
            {
                message: "avatar can't be empty"
            }
        )
    }
   

   const newid = uuidv4();
    const user = [
        {
        first_name: `${first_name}`,
        last_name:` ${last_name}`,
        email: `${email}`,
        avatar: `${avatar}`,
        id:id !== undefined ? id: newid
        }
    ]

   try {  
    res.send({
        data: user,        
        });
   } catch (error) {
        next(error)
   }
})

//update user
app.put('/updateuser/:id',(req,res)=>{
     let userid = req.params.id ;
     const {first_name, email, avatar , last_name} = req.body;

     let updateuser = users.find(obj => obj.id == userid);
     
    const user = [
        {
        first_name: `${first_name}`,
        last_name:` ${last_name}`,
        email: `${email}`,
        avatar: `${avatar}`,
        id: `${updateuser.id}`,
        }
    ]

     res.send({
          data:user,
          sucess: true
     })
})

//get user paginated
app.get('/getallusers/paginate', paginatedResults(users), (req, res) => {
    setTimeout(() => {
        res.json(res.paginatedResults);
    }, 3000);
});

//get user by id
app.get('/getuser/:id', (req, res) => {
    userid = req.params.id ?
       users.find( obj => obj.id == req.params.id )
       : "ID NOT FOUND";
   res.send({data:userid},
    );
});

// delete specific user
app.delete(`/removeuser/:id`, (req,res)=>{
    userid = req.params.id ;
     let remomveitem = users.find(obj => obj.id == userid);
     users.pop(remomveitem)
     res.send({
        "total_records": users.length,
         "total_pages": 1,
         "page": 1,
         "per_page": users.length,
        data:users
     })
})

// delete all users
app.delete(`/removeallusers`, (req,res)=>{
   users.splice(0,users.length)
     res.send({
        "total_records": users.length,
         "total_pages": 1,
         "page": 1,
         "per_page": users.length,
        data: users
     })
})

/* --------------- */
      //Login API 
/* --------------- */

app.post('/login',validations(users), (req, res)=>{
    res.json(res.validations)
})