const express = require("express");
const { join } = require("path");
const { readJSON, writeJSON } = require("fs-extra");

const router = express.Router();
const readDataBase = async (path) => {
  try {
    const jsonFile = await readJSON(join(__dirname, path));
    return jsonFile;
  } catch (error) {
    throw new Error(error);
    console.log(error);
  }
};



router.get("/", async (req, res, next) => {
  try {
    const imageDB = await readDataBase("files.json");
    console.log(req.body);
    if (imageDB) {
      res.send(imageDB);
    } else
      res.send("404 - Nothing seems to be here. Try to post something first.");
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    const imageDB = await readDataBase("files.json");
    console.log(req.body);
    if (imageDB) {
      let img = imageDB.filter((img) => img.id === req.params.id)
      res.send(img);
    } else
      res.send("404 - Nothing seems to be here. Try to post something first.");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
