const express = require("express");
const router = express.Router();
const db = require("../database/db_connection");
const fs = require("fs");
const bcrypt = require("bcrypt");
//token
const jwt = require("jsonwebtoken");
const JWT_SECRET =
  "asdaso973r2asd21132sda21315dffad63579sffd773452432fdsykm;drfw.;[,'asho453o532''..vxcvvddv's";

//fs storage
const { uploadRegister, uploadEditProfile } = require("../utils/storage");
//my functions
const {
  fetchUserFormDatabase,
  readImageFromFolder,
  findImagesInDatabase,
  findAvatarInDatabase,
  deleteImageFromFolder,
  deleteImagesFromDatabase,
  deleteUserFromDatabase,
  changeAvatarInDatabase,
  checkEmailExistsInDatabase,
  changeEmailInDatabase,
  checkUsernameExistsInDatabase,
  changeUsernameInDatabase,
  fetchUserFromDatabaseByUsername,
  deleteAllUserRatingsByUserId,
} = require("../utils/functions");
//middlewares imports
const {
  checkUsernameExistsRegistration,
  checkEmailExistsRegistration,
  checkUsernameExistsLogin,
  // findAvatarInDatabase,
} = require("../middlewares/users");
//sending emails imports
const { sendForgotPasswordEmail } = require("../utils/sendingEmails");

//REGISTRATION
router.post(
  "/register",
  uploadRegister.single("image"),
  async function (req, res) {
    const { username, email, password, date_of_birth } = req.body;
    try {
      let user = await fetchUserFromDatabaseByUsername(username);
      if (user !== null)
        return res.status(404).send("username already exists in database!");

      let emailExistResult = await checkEmailExistsInDatabase(email);
      if (emailExistResult !== null)
        return res.status(404).send("Email already exists in database!");

      let salt = await bcrypt.genSalt(10);
      let hashed = await bcrypt.hash(password, salt);

      let avatarName = req.file === undefined ? null : req.file.filename;

      db.query(
        "INSERT INTO users(username, email, password, avatar, date_of_birth) VALUES (?, ?, ?, ?, ?)",
        [username, email, hashed, avatarName, date_of_birth],
        (err, results) => {
          if (err) return res.status(500).send("cannot register user!");
          else
            return res.status(200).send("user has been added to database :)");
        }
      );
    } catch (err) {
      console.log(err);
      return res.status(500).send("something went wrong!");
    }
  }
);
//LOGIN
router.post("/login", checkUsernameExistsLogin, async (req, res) => {
  const { username, password } = req.body;

  try {
    //1. find user in database
    let user = await fetchUserFromDatabaseByUsername(username);
    if (user === null) return res.status(404).send("user does not exist");
    //1. check password is correct
    let passwordIsGood = await bcrypt.compare(password, user.password);
    if (passwordIsGood === false)
      return res.status(401).send("incorrect password!");

    //3. generate token
    const token = jwt.sign(
      { username: user.username, id: user.ID },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    //4. read avatar from folder
    let filename = user.avatar === null ? "avatar-default.jpg" : user.avatar;
    let avatar = await readImageFromFolder(filename, "./images/avatars/");
    res.status(200).send({
      user: {
        username: user.username,
        ID: user.ID,
        email: user.email,
        // avatar: Buffer.from(avatar).toString("base64"),
        avatar: avatar,
        date_of_birth: user.date_of_birth,
        role: user.role,
        token: token,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("something went wrong, try again later");
  }
});
//CHANGE USER PASSWORD
router.post("/change-password", async (req, res) => {
  const { originalPass, newPass, userId } = req.body;
  try {
    let user = await fetchUserFormDatabase(userId);

    bcrypt.compare(originalPass, user.password).then((data) => {
      if (data === true) {
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(newPass, salt).then((nextData) => {
            db.query(
              "UPDATE users SET password=? WHERE Id=? ",
              [nextData, userId],
              (err) => {
                if (err) return res.status(500).send("Cannot change password!");
                else return res.status(200).send("Password changed");
              }
            );
          });
        });
      } else {
        res.status(401).send("Incorrect password!!");
      }
    });
  } catch (err) {
    res.status(500).send("Cannot change password!");
  }
});
//FORGOT PASSWORD
//1.first step - username from frontend
router.post("/forgot-password", async (req, res) => {
  const { username } = req.body;
  try {
    let user = await fetchUserFromDatabaseByUsername(username);
    if (user === null) res.status(404).send("User does not exist!");
    else {
      const secret = JWT_SECRET + user.password;
      const token = jwt.sign({ username: user.username, id: user.ID }, secret, {
        expiresIn: "5m",
      });
      const link = `http://localhost:3001/users/reset-password/${user.ID}/${token}`;
      sendForgotPasswordEmail(user.email, link);
      res.status(200).send("xxx");
    }
  } catch (err) {
    res.status(500).send("An error occurred!");
  }
});
//2.second step - display set new password view
router.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;

  try {
    let user = await fetchUserFormDatabase(id);
    if (user === null) res.send("User does not exist!");
    else {
      try {
        const secret = JWT_SECRET + user.password;
        const verify = jwt.verify(token, secret);
        res.render("resetPassword", {
          username: verify.username,
        });
      } catch (err) {
        res.send("not verified");
      }
    }
  } catch (err) {
    res.status(500).send("An error occurred!");
  }
});
//3.third step - route after submit new password
router.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  console.log(password);
  try {
    let user = await fetchUserFormDatabase(id);
    if (user === null) res.send("User does not exist!");
    else {
      const secret = JWT_SECRET + user.password;
      try {
        const verify = jwt.verify(token, secret);
        const encrypted = await bcrypt.hash(password, 10);
        console.log(verify, encrypted);
        db.query(
          "UPDATE users SET password=? WHERE Id=? ",
          [encrypted, id],
          (err) => {
            if (err) {
              console.log(err);
              res.status(500).send("Cannot change password!");
            } else {
              res.status(200).send("Password changed");
            }
          }
        );
      } catch (err) {
        res.send("not verified");
      }
    }
  } catch (err) {
    res.status(500).send("An error occurred!");
  }
});
//user profile
router.post("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  let user = await fetchUserFormDatabase(userId);
  if (user === null) {
    res.status(404).send("user not found");
  } else {
    const { username, email, avatar, date_of_birth, ID, role } = user;
    console.log(avatar, username);
    if (avatar === null) {
      readImageFromFolder("avatar-default.jpg", "./images/avatars/default/")
        .then((data) => {
          res.status(200).send({
            username: username,
            email: email,
            avatar: data,
            date_of_birth: date_of_birth,
            id: ID,
            role: role,
          });
        })
        .catch((err) => {
          res.status(500).send("Cannot fetch user data!");
        });
    } else {
      readImageFromFolder(avatar, "./images/avatars/")
        .then((data) => {
          res.status(200).send({
            username: username,
            email: email,
            avatar: data,
            date_of_birth: date_of_birth,
            id: ID,
            role: role,
          });
        })
        .catch((err) => {
          res.status(500).send("Cannot fetch user data!");
        });
    }
  }
});

router
  .route("/:user_id")
  //MIDDLEWARE CHECKING TOKEN
  .all((req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];

    const user = jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(401).json({ meessage: "token expired" });
      } else {
        next();
      }
    });
  })
  //SEND USER'S INFORMATIONS TO FRONTEND FOR LOGGED USER
  .post(async (req, res) => {
    const id = req.body.id;
    //find user in database
    let user = await fetchUserFormDatabase(id);

    console.log(user.avatar);
    if (user === null) res.status(404).send("Cannot find user in database");

    let filename = user.avatar === null ? "avatar-default.jpg" : user.avatar;
    try {
      const avatar = await readImageFromFolder(filename, "./images/avatars/");

      res.set({ "Content-Type": "image/png" });
      res.status(200).send({
        id: user.ID,
        avatar: avatar,
        date_of_birth: user.date_of_birth,
        email: user.email,
        username: user.username,
        role: user.role,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  })
  //UPDATE USER'S PROFILE = username, avatar, email
  .put(uploadEditProfile.single("newAvatar"), async (req, res) => {
    //UPDATE USER'S PROFILE
    //zależnie od tego jak informacja przyjdzie z fronta newEmail/newUsername/newAvatar
    //wykonuje się poszczególny warunek z instrukcji if
    //user_id jest potrzebne do każdej operacji

    const { user_id } = req.params;
    const { newUsername, newEmail } = req.body;
    const newAvatar = req.file;

    try {
      if (newUsername) {
        //1. check username exists in database
        let check = await checkUsernameExistsInDatabase(newUsername);
        if (check) {
          res.status(409).send("Username already exists in database!");
        } else {
          await changeUsernameInDatabase(user_id, newUsername, 5);
          res.status(200).send("Username has been changed successfully!");
        }
      } else if (newEmail) {
        //1. check email exists in database
        let check = await checkEmailExistsInDatabase(newEmail);
        if (check) {
          res.status(409).send("Email already exists in database!");
        } else {
          await changeEmailInDatabase(user_id, newEmail);
          res.status(200).send("Email has been changed!");
        }
      } else if (newAvatar) {
        let oldAvatar = await findAvatarInDatabase(user_id);
        if (oldAvatar === null) {
          await changeAvatarInDatabase(user_id, newAvatar.filename);
          res.status(200).send("Avatar changed!");
        } else {
          //we must delete old avatar from folder
          // deleteAvatarFromFolder(oldAvatar.avatar);
          //save newAvatar's filename in database
          await changeAvatarInDatabase(user_id, newAvatar.filename);
          res.status(200).send("Avatar changed!");
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).send("An error occurred while processing the request!");
    }
  })
  //DELETE ACCOUNT
  .delete(async (req, res) => {
    const { user_id } = req.params;

    try {
      let imagesToDelete = await findImagesInDatabase(user_id);
      let avatarToDelete = await findAvatarInDatabase(user_id);

      // 1.delete avatar from folder
      if (avatarToDelete.avatar !== null) {
        await deleteImageFromFolder(avatarToDelete.avatar, "./images/avatars/");
      } else console.log("no avatar to delete");

      // // 2.delete all images from folder
      if (imagesToDelete.length !== 0) {
        for (const item of imagesToDelete) {
          await deleteImageFromFolder(item.name, "./images/usersImages/");
        }
      } else console.log("no images to delete!");

      await deleteImagesFromDatabase(user_id);
      await deleteUserFromDatabase(user_id);
      await deleteAllUserRatingsByUserId(user_id);
      res.status(200).send("User deleted successfully");
    } catch (err) {
      console.log(err);
      res.status(500).send("Something gone wrong while deleting the account");
    }
  });

module.exports = router;
