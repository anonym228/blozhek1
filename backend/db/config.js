const mongoose = require("mongoose");

async function tryConnectToServer(url) {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true
    });
    console.log("connected");
  } catch (error) {
    console.log(error);
  }
}

module.exports = tryConnectToServer;
