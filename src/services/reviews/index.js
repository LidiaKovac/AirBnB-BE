const express = require("express");
const fs = require("fs");
const path = require("path");
const uniqid = require("uniqid");
const { writeFile} = require("fs-extra")
const { join } = require("path");
const { readJSON, writeJSON } = require("fs-extra");
const { check, validationResult } = require("express-validator");

const router = express.Router();

//router.get('/:id')
//router.post("/:id")
//router.delete("/:revid")
//dividere id casa da id review, 

module.exports = router;
