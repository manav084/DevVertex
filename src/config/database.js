const mongoose = require('mongoose');

const connectDB = async () => {
 
await mongoose.connect("mongodb+srv://manavpandey:manav2120@devvertex-cluster.8bnr052.mongodb.net/devvertex?retryWrites=true&w=majority")

}

module.exports = connectDB;
