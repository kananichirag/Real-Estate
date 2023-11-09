const express = require('express');
const mongoose = require('mongoose')
const path = require('path');
const app = express();
const UserRoutes = require('./routes/userRoutes')
const AuthRoutes = require('./routes/AuthRoutes')
const ListingRoutes = require('../api/routes/ListingRoutes')
const cookieParser = require('cookie-parser')
require('dotenv').config({path:path.join(__dirname,'.env')})

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())


app.use('/api/user',UserRoutes);
app.use('/api/auth',AuthRoutes);
app.use('/api/listing',ListingRoutes);
app.use(express.static(path.join(__dirname,'/frontend/dist')))

// app.get('*',(req,res) => {
//     res.sendFile(path.join(__dirname,'frontend','index.html'))
// })
app.use((err,req,res,next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message})
    })
    // Mongo DB Connection
    mongoose.connect(process.env.MONGO).then((e) => console.log('Mongo-DB Connected.!!!')).catch((err) => {
        console.log("Error Conteing Mongo ==>",err)
    })
    //const  __dirname = path.resolve();


app.listen(process.env.PORT, () => console.log('Server Start.!!'))