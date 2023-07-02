const express = require("express");
const router = express.Router();
const db = require("../database/db_connection");
const fs = require("fs");

const {
  deleteImageFromFolder,
  deleteImageFromDatabase,
  fetchImageNameByIdFromDatabase,
  findImagesInDatabase,
  findAvatarInDatabase,
  deleteImagesFromDatabase,
  deleteUserFromDatabase,
  deleteAllUserRatingsByUserId,
} = require("../utils/functions");

router.get("/all-users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).send("Cannot upload users!");
    else res.status(200).send(results);
  });
});
router.get("/all-images", (req, res) => {
  db.query("SELECT * FROM images", (err, results) => {
    if (err) return res.status(500).send("Cannot upload images!");
    else res.status(200).send(results);
  });
});

router.delete(`/image-delete/:imageId`, async (req, res) => {
  const { imageId } = req.params;
  try {
    const imageName = await fetchImageNameByIdFromDatabase(imageId);
    await deleteImageFromFolder(imageName, "./images/usersImages/");
    await deleteImageFromDatabase(imageId);
    res.status(200).send("image deleted");
  } catch (err) {
    res.status(500).send("cannot delete image");
  }
});
router.delete(`/user-delete/:userId`, async (req, res) => {
  const { userId } = req.params;
  try {
    let imagesToDelete = await findImagesInDatabase(userId);
    let avatarToDelete = await findAvatarInDatabase(userId);

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

    await deleteImagesFromDatabase(userId);
    await deleteUserFromDatabase(userId);
    await deleteAllUserRatingsByUserId(userId);
    res.status(200).send("User deleted successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something gone wrong while deleting the account");
  }
});
module.exports = router;
