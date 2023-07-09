const db = require("../database/db_connection");
const JWT_SECRET =
  "asdaso973r2asd21132sda21315dffad63579sffd773452432fdsykm;drfw.;[,'asho453o532''..vxcvvddv's";
const jwt = require("jsonwebtoken");
const {
  checkUsernameExistsInDatabase,
  checkEmailExistsInDatabase,
} = require("../utils/functions");
//register middlewares
const checkEmailExistsRegistration = async (req, res, next) => {
  const email = req.body.email;

  const count = await checkEmailExistsInDatabase(email);

  if (count === null) next();
  else res.status(404).send("email already exists in database!");
};

const checkUsernameExistsRegistration = async (req, res, next) => {
  const { username } = req.body;

  let count = await checkUsernameExistsInDatabase(username);

  if (count === null) next();
  else res.status(404).send("username already exists in database!");
};
//login middlewares
function checkUsernameExistsLogin(req, res, next) {
  const { username } = req.body;

  db.query(
    "SELECT * FROM users WHERE username=?",
    [username],
    (err, results) => {
      if (err) throw err;
      if (results[0] === undefined) {
        return res.status(404).send({ message: "User does not exist" });
      }
      next();
    }
  );
}
//check token
const checkToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (typeof authHeader === "undefined") {
    return res.status(401).send("Unauthorized");
  }

  const token = authHeader.split(" ")[1];
  const user = jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ message: "token expired" });
    } else {
      next();
    }
  });
};

exports.checkEmailExistsRegistration = checkEmailExistsRegistration;
exports.checkUsernameExistsRegistration = checkUsernameExistsRegistration;
exports.checkUsernameExistsLogin = checkUsernameExistsLogin;
exports.checkToken = checkToken;
