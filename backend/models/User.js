const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  date: {
    type: Date,
    default: Date.now,
  },
  questions:{
    type:Boolean,
    default:false
  },
  phone:{
    type:Number,
    require:true
  }
});
const User = mongoose.model("user", UserSchema);
module.exports = User;
