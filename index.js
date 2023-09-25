const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose=require('mongoose')
const app = express();
require('dotenv').config()
const connectDb=require('./config/db')


//connect to mongodb
connectDb()

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const homeRoutes = require('./routes/home');

app.use('/signup', signupRoutes);
app.use('/login', loginRoutes);
app.use('/home', homeRoutes);




const PORT = process.env.PORT || 3010;


mongoose.connection.once('open',()=>{
    console.log("Connected to mongoDB")
    app.listen(PORT,()=>{
        console.log(`Network server running on port ${PORT}`);
      })
})
