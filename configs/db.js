const mongoose = require('mongoose');

function buildConnectionString() {
    if (process.env.MONGO_URI) {
        return process.env.MONGO_URI;
    }
    const username = encodeURIComponent(process.env.MONGO_USERNAME || "");
    const password = encodeURIComponent(process.env.MONGO_PASSWORD || "");
    const host = process.env.MONGO_HOST || "luster0.kwi7qy7.mongodb.net";
    return `mongodb+srv://${username}:${password}@${host}/?retryWrites=true&w=majority`;
}

const connectDB = async () => {
    try {
        await mongoose.connect(buildConnectionString());
        console.log("MongoDB ile bağlantı kuruldu");
    } catch (err) {
        console.error("MongoDB bağlantısı kurulamadı:", err.message);
        process.exit(1);
    }
};

module.exports = {
    connectDB
};
