const dotenv = require("dotenv");
dotenv.config();
const mongodbURL = process.env.mongodbURL
// import mongodbURL from process.env
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const  connectToMongo = async ()=>{
    await mongoose.connect(mongodbURL, ).then(()=>{
         console.log("Connected to Mongo Successfully");
     }).catch((e)=>{
         console.log(e);
     })
 }
 
module.exports = connectToMongo;
