const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');
 
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
    let users = model;
    let userdetails = users.find(obj => obj.email == email && obj.password == password);
    if(userdetails){
         return res.send({
                data: userdetails
           })
    }else{
       return res.send({
                message: "User Not Found"
           })
    }
    next();
  }
}