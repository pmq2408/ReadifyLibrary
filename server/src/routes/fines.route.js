const express = require("express");
const bodyParser = require("body-parser");
const finesController = require("../controllers/fines.controller");

const finesRouter = express.Router();
finesRouter.use(bodyParser.json());

finesRouter.get("/getAll", finesController.getAllFines);

module.exports = finesRouter;
