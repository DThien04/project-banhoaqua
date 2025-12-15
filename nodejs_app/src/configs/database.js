const mongoose = require("mongoose");
require("dotenv").config();
const ConnectionString = process.env.MONGO_DB_URL;
module.exports.connect = async () => {
  try {
    await mongoose.connect(ConnectionString);
    console.log("Kết nối tới database rồi nha ");
  } catch (error) {
    console.log(`Không kết nối được rồi, nó đang bị ${error}`);
  }
};
