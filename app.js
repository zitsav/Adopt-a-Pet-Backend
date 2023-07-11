const express = require('express')
const app = express()
require('dotenv').config()

const port = process.env.port || 5000

const connectDB = require('./db/connect')

const start = async () =>{
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`server listening to port ${port}`))
    }
    catch (error){
        console.log(error)
    }
}

start()