const express = require("express");
const bodyParser = require("body-parser");
const orderController = require("../controllers/order.controller");

const orderRouter = express.Router();
orderRouter.use(bodyParser.json());

orderRouter.get("/getAll", orderController.getAllOrder);

orderRouter.get("/by-order/:orderId", orderController.getOrderById);

orderRouter.get("/by-user/:userId", orderController.getOrderByUserId);

orderRouter.get(
  "/by-identifier-code/:identifierCode",
  orderController.getOrderByIdentifierCode
);
orderRouter.get(
  "/manage-by-identifier-code/:identifierCode",
  orderController.getManageOrderByIdentifierCode
);

orderRouter.post("/create-borrow/:bookId", orderController.createBorrowOrder);

orderRouter.put("/change-status/:orderId", orderController.changeOrderStatus);

orderRouter.put("/approve-all", orderController.bulkUpdateOrderStatus);

orderRouter.post("/renew/:orderId", orderController.renewOrder);

orderRouter.post("/return/:orderId", orderController.returnOrder);

orderRouter.get("/filter", orderController.filterOrdersByStatus);

orderRouter.put("/report-lost/:orderId", orderController.reportLostBook);

orderRouter.post("/lost-fines/:orderId", orderController.applyFinesForLostBook);

orderRouter.get("/chart-order-by-month", orderController.ChartOrderbyMonth);

//for testing and demo
orderRouter.get("/cancel-overdue", orderController.cancelOverdueOrders);

orderRouter.get("/reminder-due-date", orderController.reminderDueDatesOrder);

orderRouter.get("/reminder-overdue", orderController.reminderOverdueOrder);
module.exports = orderRouter;
