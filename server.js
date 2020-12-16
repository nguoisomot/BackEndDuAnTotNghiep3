const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
require('dotenv').config();


//Link connect font-end
var corsOptions = {
  origin1: "http://localhost:8000",
  origin2: "http://localhost:3000",

}
app.use(cors(corsOptions))

app.use(bodyParser.json())
console.log(process.env.CLIENT_URL)

// app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static('public'));

// connect database
const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
  

require('./app/routers/shop.router')(app);
require('./app/routers/user.router')(app);
app.listen(3001, () => {
  console.log("Server is running on port 3001")
})