const db = require("../database/db_connection");

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

exports.checkEmailExistsRegistration = checkEmailExistsRegistration;
exports.checkUsernameExistsRegistration = checkUsernameExistsRegistration;
exports.checkUsernameExistsLogin = checkUsernameExistsLogin;
// exports.checkEmailExistsRegistration = checkTokenIsValid;
