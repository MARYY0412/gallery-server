const express = require("express");
const router = express.Router();
const db = require("../database/db_connection");

///utils imports
const {
  deleteImageFromFolder,
  deleteImageFromDatabase,
  fetchImageNameByIdFromDatabase,
  findImagesInDatabase,
  findAvatarInDatabase,
  deleteImagesFromDatabase,
  deleteUserFromDatabase,
  deleteAllUserRatingsByUserId,
  fetchUsernameByIdFromDatabase
} = require("../utils/functions");
//middlewares imports
const { checkToken } = require("../middlewares/users");
//download data to admin panel
router.get("/all-users", checkToken, (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).send("Cannot upload users!");
    else res.status(200).send(results);
  });
});
router.get("/all-images", checkToken, async (req, res) => {
  try {
    db.query("SELECT * FROM images", async (err, results) => {
      if (err) {
        return res.status(500).send("Cannot fetch images!");
      } else {
        const ImagesWithUsernames = await Promise.all(
          results.map(async (x) => {
            const username = await fetchUsernameByIdFromDatabase(x.user_id);
            return { ...x, username };
          })
        );

        console.log(ImagesWithUsernames);
        res.status(200).send(ImagesWithUsernames);
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});



router.delete(`/image-delete/:imageId`, checkToken, async (req, res) => {
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
router.delete(`/user-delete/:userId`, checkToken, async (req, res) => {
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
