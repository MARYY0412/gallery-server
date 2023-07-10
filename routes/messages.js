const express = require("express");
const router = express.Router();
const db = require("../database/db_connection");

const { checkUsernameExistsInDatabase } = require("../utils/functions");
const { checkToken } = require("../middlewares/users");
router.get("/received/:userId", checkToken, (req, res) => {
  db.query(
    "SELECT messages.*, sender.username AS senderUsername, recipent.username AS recipentUsername FROM messages JOIN users AS sender ON messages.sender = sender.ID JOIN users AS recipent ON messages.recipent = recipent.ID WHERE messages.recipent = ?",
    [req.params.userId],
    (err, results) => {
      if (err) res.status(500).send("cannot fetch received messages");
      else res.status(200).send(results);
    }
  );
});
router.get("/sent/:userId", checkToken, (req, res) => {
  db.query(
    "SELECT messages.*, sender.username AS senderUsername, recipent.username AS recipentUsername FROM messages JOIN users AS sender ON messages.sender = sender.ID JOIN users AS recipent ON messages.recipent = recipent.ID WHERE sender=?",
    [req.params.userId],
    (err, results) => {
      if (err) res.status(500).send("cannot fetch sent messages");
      else res.status(200).send(results);
    }
  );
});
router.post("/delete", checkToken, (req, res) => {
  console.log(req.body.data);

  if (req.body.data.length === 0) res.status(404).send("no images to delete!");
  else {
    req.body.data.forEach((id) => {
      db.query("DELETE FROM messages where ID=?", [id], (err) => {
        if (err) console.log("cannot delete message!!");
        else console.log("message deleted");
      });
    });

    res.status(200).send("messages has been deleted!");
  }
});
router.post("/send", checkToken, (req, res) => {
  const { sender, recipent, content, date, theme } = req.body.data;

  //   db.query(
  //     "INSERT INTO messages (content, sender, recipent, theme, date) VALUES (?,?,?,?,?)",
  //     [content, sender, recipent, theme, date],
  //     (err) => {
  //       if (err) res.status(500).send("cannot send message");
  //       else res.status(200).send("Message has been sent");
  //     }
  //   );

  res.status(200).send("messages has been deleted!");
});

router.post("/check-recipents", async (req, res) => {
  const { data } = req.body;
  let final = [];
  //delete spaces
  cleanedData = data.split(" ").join("");
  //make an array
  const arr = cleanedData.split(",");

  for (const item of arr) {
    const user = await checkUsernameExistsInDatabase(item);
    if (user === null) final.push({ username: item, flag: false });
    else final.push({ username: item, flag: true });
  }
  res.status(200).send(final);
});
module.exports = router;
