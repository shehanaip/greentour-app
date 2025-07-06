const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const Tour = require('./../../models/tourModel')
const User = require('./../../models/userModel')
const Review = require('./../../models/reviewModel')


console.log('Database:', process.env.DATABASE);
console.log('Database Password:', process.env.DATABASE_PASSWORD);

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true, // Add this option
}).then(() => {
  console.log('DB connection successful');
}).catch(err => {
  console.error('DB connection error:', err);
});
//reading the json file
const tours =JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf8'));
const users =JSON.parse(fs.readFileSync(`${__dirname}/users.json`,'utf8'));
const reviews =JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`,'utf8'));

//importing in db

const importData = async ()=>{
    try{
        await Tour.create(tours);
        await User.create(users,{validateBeforeSave:true});
        await Review.create(reviews);
        console.log("data successfully loaded !!");
        

    }catch(err){
       console.log(err);
    }
    process.exit();
}

const deleteData = async () => {
  try {
      await Tour.deleteMany({}) 
      await User.deleteMany({})
      await Review.deleteMany({})
      console.log("data successfully deleted !!");
  } catch (err) {
      console.log(err);
  }
  process.exit();
}

if(process.argv[2]  ==='--import'){
    importData();

}else if(process.argv[2] ==='--delete'){
    deleteData();

}

//node ./dev-data/data/import-dev-data.js --import or delete
