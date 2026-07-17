const mongoose = require('mongoose');



async function connectDB() {

   try {
     
     await mongoose.connect(process.env.mongodb_uri)
     console.log('Connected to MongoDB');
    } 
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
    
}
   }

   module.exports = connectDB;

