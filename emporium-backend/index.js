const express = require('express');
const session = require('express-session');
const sessionConfig = require('./middlewares/sessionConfig');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const authRouter = require("./routes/authRoute");
const bodyParser = require('body-parser');
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const { notFound, errorHandler } = require('./middlewares/errorHandler');

// const { displayUsers,displayItems,displayOrders,displayOrderItems } = require('./config/dbConnect');

const app = express();


// app.use((req,res,next) =>{
//     console.log(req.session);
//     next();
// });
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true // Allow cookies to be sent
  }));  

// app.use(session(sessionConfig));
app.use(cookieParser());
// Call each display function
// displayUsers();
// displayItems();
// displayOrders();
// displayOrderItems();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// app.use(session(sessionConfig));

app.use('/api/user', authRouter);

// app.use(notFound);
// app.use(errorHandler);


app.listen(PORT, ()=>{
    console.log(`Server is running at Port: ${PORT}`)
});