
const mongoose = require("mongoose")

 async function connectdb () {
    try{
        mongoose.connect("mongodb://127.0.0.1:27017/Registraion")
        console.log('DataBase is Connected')
    }
    catch(error){
        console.log(error)
    }
 }
 connectdb()