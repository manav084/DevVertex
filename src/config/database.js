const mongoose = require('mongoose');
// MONGOURL
const connectDB = async () => {
 
await mongoose.connect(process.env.MONGO_URL)

}

module.exports = connectDB;
