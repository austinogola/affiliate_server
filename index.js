const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose=require('mongoose')
const app = express();
const cors = require('cors');
require('dotenv').config()
const connectDb=require('./config/db')
app.use(express.static("./public"))
app.use('/public/icons/', express.static('./public/icons'))


//connect to mongodb
connectDb()


app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors());


const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const homeRoutes = require('./routes/home');
const apiRoutes = require('./routes/api');


app.use('/signup', signupRoutes);
app.use('/login', loginRoutes);
app.use('/home', homeRoutes);
app.use('/api',apiRoutes)
app.use('/',homeRoutes)





const PORT = process.env.PORT || 3010;


mongoose.connection.once('open',()=>{
    console.log("Connected to mongoDB")
    app.listen(PORT,()=>{
        console.log(`Network server running on port ${PORT}`);
      })
})
