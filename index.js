const express = require("express");
const app = express();
var db = require("./database/db_connection");
const cors = require("cors");
const ejs = require("ejs");

// const bodyParser = require("body-parser");
// app.use(bodyParser.json());
app.set("view engine", "ejs");
app.engine("ejs", ejs.renderFile);
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is working!");
});

const userRouter = require("./routes/users");
app.use("/users", userRouter);

const photosRouter = require("./routes/photos");
app.use("/photos", photosRouter);

const adminRouter = require("./routes/admin");
app.use("/admin", adminRouter);

const messsagesRouter = require("./routes/messages");
app.use("/messages", messsagesRouter);
app.listen(3001);

// Eksportowanie adminRouter jako funkcji pośredniczącej
// module.exports = adminRouter;
