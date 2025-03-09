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

finesRouter.post("/create", finesController.createFines);

finesRouter.put("/update/:finesId", finesController.updateFines);

finesRouter.delete("/delete/:finesId", finesController.deleteFines);

finesRouter.get(
    "/filter-by-status/:status",
    finesController.filterFinesByStatus
  );
  
finesRouter.put("/update-status/:finesId", finesController.updateFinesStatus);

finesRouter.post("/check-payment/:paymentKey", finesController.checkPayment);

finesRouter.get("/chart-fines-by-month", finesController.ChartFinesbyMonth);

module.exports = finesRouter;
