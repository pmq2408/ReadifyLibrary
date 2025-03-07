const express = require("express");
const bodyParser = require("body-parser");
const finesController = require("../controllers/fines.controller");

const finesRouter = express.Router();
finesRouter.use(bodyParser.json());

finesRouter.get("/getAll", finesController.getAllFines);

finesRouter.get("/get/:finesId", finesController.getFinesById);

finesRouter.get("/by-user/:userId", finesController.getFinesByUserId);

finesRouter.get("/by-order/:orderId", finesController.getFinesByOrderId);

finesRouter.get("/by-code/:userCode", finesController.getFinesByUserCode);
module.exports = finesRouter;
