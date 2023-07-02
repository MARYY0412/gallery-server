const db = require("../database/db_connection");
const express = require("express");
const router = express.Router();

// const fs = require("fs").promises;
const fs = require("fs");
//functions
const {
  readImageFromFolder,
  fetchUsernameByIdFromDatabase,
  deleteImageFromDatabase,
  deleteImageFromFolder,
  addImageRatingToDatabase,
  checkImageRatingExistInDatabase,
  updateImageRatingExistInDatabase,
  fetchImageRatingsFromDatabase,
  findImagesInDatabase,
  fetchBestRatedImagesFromDatabase,
  deleteImageRatingsByIdFromDatabase,
} = require("../utils/functions");
//storage
const { uploadMultiple, uploadSingle } = require("../utils/storage");

//ADDING IMAGES BY USERS
router.post("/addsingle", uploadSingle.single("image"), (req, res) => {
  const query = `INSERT INTO images (name, user_id, description, date_added) VALUES (?, ?, ?, ?)`;
  db.query(
    query,
    [
      req.file.filename,
      req.body.user_id,
      req.body.description,
      req.body.dateAdded,
    ],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("cannot add image to database!!");
      } else {
        res.status(200).send("image has been added to database!");
      }
    }
  );
});
router.post("/addmultiple", uploadMultiple.array("images"), (req, res) => {
  let query =
    "INSERT INTO images(name, user_id, description, date_added) VALUES (?, ?, ?, ?)";
  console.log(req.body);

  req.files.forEach((item, index) => {
    db.query(
      query,
      [req.files[index].filename, req.body.user_id, null, req.body.date_added],
      (err, results) => {
        if (err) res.status(500).send("cannot add images to database");
        else res.status(200).send("images has been added to database!");
      }
    );
  });
});

//SENDING USER IMAGES TO FRONT
router.get("/user/:user_id", async (req, res) => {
  const { user_id } = req.params;
  let username = null;
  let imagesFromDatabase = [];
  let imagesToSend = [];

  try {
    username = await fetchUsernameByIdFromDatabase(user_id);
    imagesFromDatabase = await findImagesInDatabase(user_id);
    //if user doesn't have any images just send response
    if (imagesFromDatabase.length === 0) res.status(200).send([]);
    else {
      for (const item of imagesFromDatabase) {
        let image = await readImageFromFolder(
          item.name,
          "./images/usersImages/"
        );
        let imageRatings = await fetchImageRatingsFromDatabase(item.ID);
        console.log(imageRatings);
        imagesToSend.push({
          ...item,
          username: username,
          data: image,
          ratings: imageRatings,
        });
      }
      res.status(200).send(imagesToSend);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Cannot upload images. try again later");
  }
});
//

//UPLOAD SPECIFIC IMAGE FROM DATABASE
router.get("/photo/:image_id", async (req, res) => {
  const { image_id } = req.params;
  const query = `SELECT * FROM images where ID="${image_id}"`;

  db.query(query, async (err, result) => {
    if (err) {
      console.log("Something gone wrong!", err);
    } else {
      if (result.length === 0) {
        res.status(404).send("File not found");
      } else {
        //find username in database by user_id
        let username = null;
        let imageRatings = [];
        try {
          username = await fetchUsernameByIdFromDatabase(result[0].user_id);
          imageRatings = await fetchImageRatingsFromDatabase(result[0].ID);
          console.log(imageRatings);
        } catch (err) {
          //if error username is still null
          console.log(err);
        }

        readImageFromFolder(result[0].name, "./images/usersImages/").then(
          (data) => {
            res.status(200).send({
              status: "ok",
              data: {
                ...result[0],
                username: username,
                data: data,
                ratings: imageRatings,
              },
            });
          }
        );
      }
    }
  });
});
//UPLOAD RANDOM IMAGES
router.get("/random/:amount", (req, res) => {
  const amount = req.params.amount;
  let AllImages = [];
  let final = [];
  db.query("SELECT * FROM images", async (err, results) => {
    if (err) return res.status(500).send("something went wrong!");

    if (results.length === 0) return res.status(404).send("no images found");
    //1.add all IDS of images to array
    results?.forEach((item) => {
      AllImages.push(item);
    });
    //.2.drawing amount of numbers
    let DrawedImages = [];
    for (let i = 0; i < amount; i++) {
      let randomIndex = Math.floor(Math.random() * AllImages.length);
      DrawedImages.push(AllImages[randomIndex]);
    }
    //.3.adding object with files to array and send array to frontend
    console.log(DrawedImages);
    for (let i = 0; i < amount; i++) {
      try {
        let dataImage = await readImageFromFolder(
          DrawedImages[i].name,
          "./images/usersImages/"
        );
        //we must have username to every image
        let username = null;
        username = await fetchUsernameByIdFromDatabase(DrawedImages[i].user_id);

        final.push({
          ...DrawedImages[i],
          username: username,
          data: dataImage,
        });
      } catch (err) {
        console.log(err);
      }
    }
    //.check array is empty
    // if (final.length === 0) {
    //   res.status(404).send("Cannot find images!");
    // } else {
    //everything ok
    res.status(200).send(final);
    // }
  });
});
//DELETE IMAGE
router.delete("/:image_id", async (req, res) => {
  const { image_id } = req.params;
  const { filename } = req.body;

  try {
    await deleteImageFromDatabase(image_id);
    await deleteImageFromFolder(filename, "./images/usersImages/");
    await deleteImageRatingsByIdFromDatabase(image_id);
    res.status(200).send("File deleted successfully!");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something gone wrong!");
  }
});
//RATE IMAGE
router.post("/rate-image", async (req, res) => {
  const { userId, imageId, value } = req.body;

  ///first check rating exists
  try {
    let checkRatingExists = await checkImageRatingExistInDatabase(
      userId,
      imageId
    );
    //if rating doesn't exist just add the new
    if (checkRatingExists === null) {
      await addImageRatingToDatabase(userId, imageId, value);
      //ratign exist so just change the value
    } else {
      await updateImageRatingExistInDatabase(userId, imageId, value);
    }
    res.status(200).send("Rating has been added to database");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something gone wrong, try again later!");
  }
});
//BEST RATED IMAGES
router.get("/best-rated", async (req, res) => {
  try {
    const imgs = await fetchBestRatedImagesFromDatabase();
    if (imgs.length !== 0) {
      const final = [];
      for (const item of imgs) {
        let imageData = await readImageFromFolder(
          item.name,
          "./images/usersImages/"
        );
        let username = await fetchUsernameByIdFromDatabase(item.ID);
        final.push({ data: imageData, username: username, ...item });
      }

      res.status(200).send(final);
    } else {
      res.status(404).send("no best rated images!");
    }
  } catch (err) {
    console.log("cannot upload images, an error occured:", err);
    res.status(500).send("cannot upload images");
  }

  // res.status(200).send("DASDASD");
  //
});
module.exports = router;
//ROUTES
