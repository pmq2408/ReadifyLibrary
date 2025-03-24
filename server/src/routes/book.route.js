const express = require("express");
const bodyParser = require("body-parser");
const bookController = require("../controllers/book.controller");

const bookRouter = express.Router();
bookRouter.use(bodyParser.json());

// Đặt route tìm kiếm theo title trước route tìm kiếm theo identifier
bookRouter.get("/search", bookController.searchBooksByTitle);
bookRouter.get("/search/:identifier", bookController.searchBookByIdentifier);

bookRouter.get("/books", bookController.getBookSetDetails);
bookRouter.put("/update/:id", bookController.updateBook);
bookRouter.delete("/delete/:id", bookController.deleteBook);
bookRouter.get("/get/:id", bookController.getBookDetail);
bookRouter.post("/list", bookController.listBooks);
bookRouter.get("/list", bookController.listBooks);
bookRouter.get("/bookset/:id", bookController.getBookSetDetails);

module.exports = bookRouter;
