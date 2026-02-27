const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const isAdmin = require("../middlewares/isAdmin.js")
const upload = require("../middlewares/multer.js")
const multer = require("multer")
const productdb = require("../models/product-model")

const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


router.get("/",isAdmin,(req,res)=>{
    res.render("admin-dash.ejs")
})

router.get("/dashboard",isAdmin,(req,res)=>{
    res.render("admin-dash.ejs")
})



router.get("/listproduct",isAdmin,upload.single("productimage"),(req,res)=>{
    res.render("new-product")
})


router.post("/listproduct", upload.single("productimage"), async (req, res) => {
  try {

    let { name, price, brand, description, quantity, type } = req.body;

    const result = await new Promise((resolve, reject) => {

      const stream = cloudinary.uploader.upload_stream(
        { folder: "hardwarehub" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);

    });
    let product = await productdb.create({
      name,
      price,
      brand,
      quantity,
      typee: type,
      description,
      image: result.secure_url
    });

    res.send("Product created successfully");

  } catch (err) {
    console.log(err);
    res.status(500).send("Upload failed");
  }
});



module.exports = router;
