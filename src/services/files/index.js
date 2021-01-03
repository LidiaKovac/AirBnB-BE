const express = require("express");
const { join } = require("path");


const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
      const publicFolderPath = join(__dirname, "../../../")
      const response = await exploreFolders(publicFolderPath)
      res.send(response)
    } catch (error) {
      next(error)
    }
})

module.exports = router;
