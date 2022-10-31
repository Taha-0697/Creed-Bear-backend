const { v4: uuidv4 } = require('uuid');
const faker = require('Faker');
 
exports.createRecords = ()=>{
const first_name = faker.name.firstName();
const last_name = faker.name.lastName();
const email = `${first_name}${last_name}@gmail.com`;
const password = faker.internet.password();
const id = uuidv4();
return  {
  id,
  email,
  password,
  first_name,
  last_name,
  "avatar": faker.internet.avatar(),
}
}

exports.paginatedResults = (model)=> {

  return (req, res, next) => {
    let PageSize = parseInt(req.query.PageSize);     
    let PageNo = parseInt(req.query.PageNo);     
    let Total_records = model.length;
    let startIndex = (PageNo - 1) * PageSize;
    let endIndex = PageNo * PageSize;
    let Total_pages =Math.ceil(Total_records / PageSize)

    if(endIndex >= model.length) {
      endIndex = model.length;
    }
    
    let results = {};
   
    let a = [];
    for(let i =startIndex; i < endIndex;i++){
      a.push(model[i])
    }

    if (a.length) {
      
      results = {
        Total_pages,
        Total_records,
        PageNo,
        PageSize,
        More: Total_records > endIndex ? true : false,
        data : a
      };
    }
   
    res.paginatedResults = results;
    next();
  };
}


exports.validations = (model)=>{
  return (req, res, next)=>{
    let {email, password} = req.body;
    let users = model.find(obj => obj.email == email && obj.password ==  password)
    if(users){
      return res.status(200).send({
        data:{
           status: "success",
           user: users,
        }
      })
    }
    else {
      return res.status(400).send({
        data:{
           status: "fail",
           user: "invalid Credentials"
        }
      })
    }
   }
}

exports.test = ()=>{
return (req, res, next)=>{
    let {email, password} = req.body;
    if(email == "admin123@gmail.com" && password == "admin123"){
      return res.status(200).send({
       data:{
         status: "success",
        user:{
          id: uuidv4(),
          firstname: email.slice(0,5),
          lastname:email.slice(5,8),
          email,
          password,
          avatar: faker.internet.avatar(),
        }
       }
      })
    }
    else if(email != "admin123@gmail.com"){
       return res.status(408).send({
          message: "Email is Not Valid"
       })
    }
    else if(password != "admin123"){
       return res.status(408).send({
          message: "Password is Not Valid"
       })
    }
    else{
      return res.status(400).send({
          message: "User Not Found"
       })
    }
    next();
   }
}