const db = require("../database/db_connection");

//register middlewares
function checkEmailExistsRegistration(req, res, next) {
  const email = req.body.email;
  console.log("check email", email);
  db.query(
    "SELECT COUNT(*) as count FROM users WHERE email = ?",
    [email],
    function (err, results, fields) {
      if (err) res.status(500).send("something went wrong");

      const count = results[0].count;
      console.log(count);
      if (count > 0) {
        return res
          .status(400)
          .send("Email address already exists in database!");
      }
      next();
    }
  );
}

function checkUsernameExistsRegistration(req, res, next) {
  const username = req.body.username;
  console.log("check username", req.body);
  db.query(
    "SELECT COUNT(*) as count FROM users WHERE username = ?",
    [username],
    function (err, results, fields) {
      if (err) res.status(500).send("something went wrong");
      else {
        const count = results[0].count;
        if (count > 0) {
          return res.status(400).send("Username already exist in database!");
        }
        next();
      }
    }
  );
}
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
