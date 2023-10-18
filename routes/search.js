const express = require("express");
const router = express.Router();
const db = require("../database/db_connection");

const {readImageFromFolder} = require("../utils/functions");

const getImagesByPhrase = (phrase) => {
        
    const queryImages = `Select images.*, users.username from images 
    LEFT JOIN users ON images.user_id = users.id
    where 
    users.username LIKE '%${phrase}%'
    OR name LIKE '%${phrase}%' 
    OR description LIKE '%${phrase}%' 
    OR date_added LIKE '%${phrase}%'`;
    
    return new Promise((resolve,reject) => {
    db.query(queryImages, 
        (err, results) => {
            if(err)
                reject(err)
            else
                resolve(results)
        })
})

    
    // //get images
    // db.query(queryImages, 
    //     (err, results) => {
    //     dataToSend = dataToSend.concat(results);
    // })
}
const getUsersByPhrase = (phrase) => {
    const queryUsers = `Select ID, username, email, date_of_birth, role, avatar from users where 
    username LIKE '%${phrase}%' 
    OR email LIKE '%${phrase}%'`;
    return new Promise((resolve,reject) => {
                //get users
        db.query(queryUsers, 
            (err, results) => {
                if(err)
                    reject(err)
                else
                    resolve(results)
            })
    })


}
const readImagesFromFolder = async (arr) => {
    let final = []
    for(let image of arr){
        let dataOfImage = await readImageFromFolder(image.name, "./images/usersImages/");
        final.push({...image, data: dataOfImage});
    }
    return final;
}
const readAvatarsFromFolder = async (arr) => {
    let final = []
    let dataOfImage;
    for(let user of arr){
        if(user.avatar !== null){
            dataOfImage = await readImageFromFolder(user.avatar, "./images/avatars/");
        }else{
            dataOfImage = await readImageFromFolder("avatar-default.jpg", "./images/avatars/");
        }
        final.push({...user, avatar: dataOfImage});
    }
    return final;
}

router.get("/all", async (req, res) => {
    const phrase = req.query.query; // Pobieramy parametr "query" z URL
    try{
        //get users and images from database
        let images = await getImagesByPhrase(phrase);
        console.log(images)
        let users = await getUsersByPhrase(phrase);
        //get images from folder and users avatars
        let finalUsers = await readAvatarsFromFolder(users);
        const finalImages = await readImagesFromFolder(images);
        //send data to frontend
        res.status(200).send({images: finalImages, users: finalUsers})
    } catch(err) {
        res.status(500).send("Server error!")
    }

})
router.get("/users", async (req, res) => {
    const phrase = req.query.query; // Pobieramy parametr "query" z URL

    try{ 
        //read user info from database
        let users = await getUsersByPhrase(phrase);
        console.log(users)
        //read avatars from database
        let finalUsers = await readAvatarsFromFolder(users);
        // console.log(finalUsers);
        res.status(200).send({users: finalUsers})
    }catch(err){
        res.status(500).send("Server error!")
    }

})
router.get("/images", async (req, res) => {
    const phrase = req.query.query; // Pobieramy parametr "query" z URL
    // let finalImages = [];
    try{ 
        //read images from database
        let imagesFromDatabase = await getImagesByPhrase(phrase);
        //read images from database
        const finalImages = await readImagesFromFolder(imagesFromDatabase);
        //send images to frontend
        res.status(200).send({images: finalImages})
    }catch(err){
        res.status(500).send("Server error!")
    }

})

module.exports = router;