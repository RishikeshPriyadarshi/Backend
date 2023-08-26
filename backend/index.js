const connectToMongo = require("./db");
const express = require("express");

connectToMongo()
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log("not connected index");
    console.log(err);
  });

const app = express();
const port = 5000;

app.use(express.json());

//available Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/ques',require('./routes/question'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})