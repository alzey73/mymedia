const mongoose = require('mongoose');

const username = "seozoglu";
const password = "13579";


const connectionString = `mongodb+srv://${username}:${password}@luster0.kwi7qy7.mongodb.net/?retryWrites=true&w=majority`;

const connectDB = async () => {
    try {
        await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("MongoDB Atlas ile bağlantı kuruldu");
    } catch (err) {
        console.log(err);
    }
};
module.exports = {
    connectDB,
    connectionString
};