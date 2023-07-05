const fs = require("fs");
var db = require("../database/db_connection");

//operations on files in folder
const readImageFromFolder = (filename, path) => {
  const fullPath = `${path}${filename}`;
  return new Promise((resolve, reject) => {
    fs.readFile(fullPath, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(Buffer.from(data).toString("base64"));
      }
    });
  });
};
const deleteImageFromFolder = (filename, path) => {
  const fullPath = `${path}${filename}`;
  return new Promise((resolve, reject) => {
    fs.unlink(fullPath, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log("File successfully deleted");
        resolve();
      }
    });
  });
};
const saveImageToFolder = (
  imageData, //buffer
  filename, //name of fiile
  directoryPath //path
  // fileExtension
) => {
  return new Promise((resolve, reject) => {
    // const filePath = `${directoryPath}/${filename}${fileExtension}`;
    const filePath = `${directoryPath}/${filename}`;
    fs.writeFile(filePath, imageData, "binary", (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(filePath);
      }
    });
  });
};
//user database
const deleteUserFromDatabase = (user_id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM users WHERE ID=?", [user_id], (err, result) => {
      if (err) reject("Cannot delete user");
      else {
        console.log("User has been deleted succesfully!");
        resolve();
      }
    });
  });
};
const fetchUserFormDatabase = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users where ID=?", [id], (err, result) => {
      if (err) {
        reject("cannot fetch user from database", err);
      } else {
        resolve(result.length === 0 ? null : result[0]);
      }
    });
  });
};
const fetchUsernameByIdFromDatabase = (user_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT username FROM users where Id=?",
      [user_id],
      (err, result) => {
        if (err) reject("cannot read username!!", err);
        else {
          resolve(result.length === 0 ? null : result[0].username);
        }
      }
    );
  });
};
const fetchUserFromDatabaseByUsername = async (username) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM users WHERE username=?",
      [username],
      (err, result) => {
        if (err) reject(err);
        else {
          resolve(result.length === 0 ? null : result[0]);
        }
      }
    );
  });
};
const checkEmailExistsInDatabase = (email) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users WHERE email=?", [email], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.length === 0 ? null : result[0]);
      }
    });
  });
};
const checkUsernameExistsInDatabase = (newUsername) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM users WHERE username=?",
      [newUsername],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.length === 0 ? null : result[0]);
        }
      }
    );
  });
};
const changeUsernameInDatabase = (user_id, newUsername) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE users SET username=? WHERE ID=?",
      [newUsername, user_id],
      (err, result) => {
        if (err) reject(err);
        else {
          resolve("Username changed!");
        }
      }
    );
  });
};
const changeEmailInDatabase = (user_id, newEmail) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE users SET email=? WHERE ID=?",
      [newEmail, user_id],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve("Email changed!");
        }
      }
    );
  });
};
const changeAvatarInDatabase = (user_id, filename) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE users SET avatar=? where ID=?",
      [filename, user_id],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve("Avatar changed!");
        }
      }
    );
  });
};

//images database
const deleteImagesFromDatabase = (user_id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM images WHERE user_id=?", [user_id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        console.log("User's images has been deleted");
        resolve();
      }
    });
  });
};
const findImagesInDatabase = (user_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM images where user_id=?",
      [user_id],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          // resolve(results.length === 0 ? null : results);
          resolve(results);
        }
      }
    );
  });
};
const findAvatarInDatabase = (user_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT avatar FROM users where id=?",
      [user_id],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.length === 0 ? null : result[0]);
        }
      }
    );
  });
};
const fetchBestRatedImagesFromDatabase = () => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM images ORDER BY AVGRating DESC LIMIT 3",
      (err, results) => {
        if (err) reject(err);
        else {
          resolve(results.length === 0 ? [] : results);
        }
      }
    );
  });
};
const deleteImageFromDatabase = (id) => {
  console.log("asdasdasd");
  const query = "DELETE FROM images WHERE ID=?";
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, result) => {
      if (err) {
        reject(err);
      }
      console.log("File successfully deleted from database");
      resolve();
    });
  });
};
const fetchImageNameByIdFromDatabase = (imageId) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT name FROM images where Id=?", [imageId], (err, result) => {
      if (err) reject("cannot read image!!", err);
      else {
        resolve(result.length === 0 ? null : result[0].name);
      }
    });
  });
};

//Rating images
const addImageRatingToDatabase = async (userId, imageId, value) => {
  const query = `INSERT INTO ratingsofimages (userId, imageId, value) VALUES (?, ?, ?)`;
  return new Promise((resolve, reject) => {
    db.query(query, [userId, imageId, value], (err) => {
      if (err) reject(err);
      else {
        console.log("Rating has been added to database!");
        resolve();
      }
    });
  });
};
const checkImageRatingExistInDatabase = async (userId, imageId) => {
  const query = `SELECT * FROM ratingsofimages WHERE userId=? AND imageId=?`;
  return new Promise((resolve, reject) => {
    db.query(query, [userId, imageId], (err, result) => {
      if (err) reject(err);
      else resolve(result.length === 0 ? null : result[0]);
    });
  });
};
const updateImageRatingExistInDatabase = async (userId, imageId, value) => {
  //UPDATE users SET username=? WHERE ID=?
  const query = `UPDATE ratingsofimages SET value=? WHERE userId=? AND imageId=?`;
  return new Promise((resolve, reject) => {
    db.query(query, [value, userId, imageId], (err, result) => {
      if (err) reject(err);
      else {
        console.log("Rating has been changed");
        resolve();
      }
    });
  });
};
const fetchImageRatingsFromDatabase = async (imageId) => {
  const query = `SELECT * FROM ratingsofimages WHERE imageId=?`;
  return new Promise((resolve, reject) => {
    db.query(query, [imageId], (err, results) => {
      if (err) reject(err);
      else resolve(results.length === 0 ? [] : results);
    });
  });
};
const deleteImageRatingsByIdFromDatabase = async (imageId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM ratingsofimages WHERE imageId=?",
      [imageId],
      (err) => {
        if (err) reject(err);
        else {
          console.log("images rating has been removed!");
          resolve();
        }
      }
    );
  });
};
const deleteAllUserRatingsByUserId = async (userId) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM ratingsofimages WHERE userId=?", [userId], (err) => {
      if (err) reject(err);
      else {
        console.log("All user ratings has been removed!");
        resolve();
      }
    });
  });
};
///////////////////////////

module.exports = {
  fetchUserFormDatabase,
  deleteImageFromFolder,
  readImageFromFolder,
  findImagesInDatabase,
  findAvatarInDatabase,
  deleteImagesFromDatabase,
  deleteUserFromDatabase,
  changeAvatarInDatabase,
  checkEmailExistsInDatabase,
  changeEmailInDatabase,
  checkUsernameExistsInDatabase,
  changeUsernameInDatabase,
  fetchUsernameByIdFromDatabase,
  deleteImageFromDatabase,
  addImageRatingToDatabase,
  checkImageRatingExistInDatabase,
  updateImageRatingExistInDatabase,
  fetchImageRatingsFromDatabase,
  fetchUserFromDatabaseByUsername,
  fetchBestRatedImagesFromDatabase,
  deleteImageRatingsByIdFromDatabase,
  deleteAllUserRatingsByUserId,
  fetchImageNameByIdFromDatabase,
  saveImageToFolder,
};
