const mongoose = require('mongoose');
const dbConnection = async () => {
    try {
        const connected = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB connected`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
};

module.exports = dbConnection;
