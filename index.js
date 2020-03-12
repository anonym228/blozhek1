const app = require("express")();
const bodyParser = require("body-parser");
const tryConnectToServer = require("./backend/db/config");
if (process.env.mode !== "prod") {
  require("dotenv").config();
}

tryConnectToServer(process.env.mongo);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", require("./backend/routes/api"));

app.listen(process.env.port, () => {
  console.log("Start " + process.env.port);
});
