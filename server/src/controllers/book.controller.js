const { default: mongoose } = require("mongoose");
const db = require("../models");
const { user: User, role: Role, book: Book, bookset: BookSet } = db;
const Order = require("../models/order.model");

const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { condition, condition_detail, status, updatedBy } = req.body;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Không tìm thấy sách." });
    }
    var update_status = status;
    if (
      book.status !== "Destroyed" &&
      (condition === "Lost" || condition === "Hard")
    ) {
      const bookSet = await BookSet.findById(book.bookSet_id);
      bookSet.availableCopies -= 1;
      bookSet.save();
      update_status = "Destroyed";
    }
    if (
      book.status === "Destroyed" &&
      (condition === "Good" || condition === "Light" || condition === "Medium")
    ) {
      const bookSet = await BookSet.findById(book.bookSet_id);
      bookSet.availableCopies += 1;
      bookSet.save();
    }
    book.condition = condition || book.condition;
    book.condition_detail = condition_detail || book.condition_detail;
    book.status = update_status || book.status;
    book.updated_by = updatedBy || book.updated_by;

    const updatedBook = await book.save();

    return res
      .status(200)
      .json({ message: "Cập nhật sách thành công", updatedBook });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi", error: error.message });
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Không tìm thấy sách." });
    }

    const bookSet = await BookSet.findById(book.bookSet_id);
    if (!bookSet) {
      return res.status(404).json({ message: "Không tìm thấy bộ sách." });
    }

    await book.deleteOne();

    bookSet.totalCopies -= 1;
    if (book.condition !== "Hard" && book.condition !== "Lost") {
      bookSet.availableCopies -= 1;
    }
    await bookSet.save();

    return res
      .status(200)
      .json({ message: "Xóa sách thành công", updatedBookSet: bookSet });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi", error: error.message });
  }
};

const getBookDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id).populate({
      path: "bookSet_id",
      model: "BookSet",
    });
    if (!book) {
      return res.status(404).json({ message: "Không tìm thấy sách." });
    }

    return res
      .status(200)
      .json({ message: "Lấy thông tin sách thành công", book });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};
const listBooks = async (req, res) => {
  try {
    const {
      condition,
      status,
      bookSet_id,
      identifier_code,
      page = 1,
      limit = 10,
    } = req.body;
    let filter = {};

    // Kiểm tra từng điều kiện và thêm vào filter nếu có
    if (condition) {
      filter.condition = condition;
    }
    if (status) {
      filter.status = status;
    }
    if (bookSet_id) {
      filter.bookSet_id = bookSet_id;
    }
    if (identifier_code) {
      filter.identifier_code = identifier_code;
    }

    // Tính toán số lượng bản ghi cần skip dựa trên trang và giới hạn
    const skip = (page - 1) * limit;

    // Tìm kiếm sách dựa trên filter, áp dụng phân trang
    const books = await Book.find(filter)
      .populate("bookSet_id", "title") // Populate để lấy thông tin tiêu đề của bộ sách nếu cần
      .populate("created_by", "name") // Populate thông tin người tạo nếu cần
      .populate("updated_by", "name") // Populate thông tin người cập nhật nếu cần
      .skip(skip)
      .limit(parseInt(limit));

    // Lấy tổng số lượng sách thoả mãn điều kiện để tính tổng số trang
    const totalBooks = await Book.countDocuments(filter);
    const totalPages = Math.ceil(totalBooks / limit);

    return res.status(200).json({
      message: "Danh sách sách được lọc và phân trang thành công.",
      data: books,
      pagination: {
        currentPage: page,
        totalPages,
        totalBooks,
      },
    });
  } catch (error) {
    console.error("Error retrieving books:", error);
    return res.status(500).json({
      message: "Có lỗi xảy ra khi lấy danh sách sách.",
      error: error.message,
    });
  }
};

const getBookSetDetails = async (req, res) => {
  try {
    const books = await BookSet.find(
      {},
      "title totalCopies availableCopies price"
    );

    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching book details:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const searchBookByIdentifier = async (req, res) => {
  try {
    const { identifier } = req.params;
    const book = await Book.findOne({ identifier_code: identifier }).populate(
      "bookSet_id"
    );

    if (!book) {
      return res.status(404).json({
        message: "Không tìm thấy sách",
        data: null,
      });
    }

    return res.status(200).json({
      message: "Tìm thấy sách thành công",
      data: book,
    });
  } catch (error) {
    console.error("Error in searchBookByIdentifier:", error);
    return res.status(500).json({
      message: "Lỗi server",
      data: null,
    });
  }
};

const searchBooksByTitle = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    console.log("Searching for books with term:", searchTerm);

    if (!searchTerm) {
      console.log("No search term provided");
      return res.status(200).json({
        message: "Vui lòng nhập từ khóa tìm kiếm",
        data: [],
      });
    }

    // Tìm tất cả các BookSet có title chứa searchTerm (case insensitive) và có sách available
    const bookSets = await BookSet.find({
      title: { $regex: searchTerm, $options: "i" },
      availableCopies: { $gt: 0 }, // Chỉ lấy những BookSet có sách available
    });
    console.log("Found bookSets:", bookSets.length);

    if (bookSets.length === 0) {
      return res.status(200).json({
        message: "Không tìm thấy sách nào có sẵn để mượn",
        data: [],
      });
    }

    // Lấy tất cả các sách thuộc các bookSet tìm được và có status = "Available"
    const availableBooks = await Book.find({
      bookSet_id: { $in: bookSets.map((bs) => bs._id) },
      status: "Available",
    }).populate({
      path: "bookSet_id",
      select: "title author availableCopies", // Thêm availableCopies vào kết quả
    });
    console.log("Found available books:", availableBooks.length);

    // Format kết quả trả về
    const formattedBooks = availableBooks.map((book) => ({
      value: book.identifier_code,
      label: `${book.bookSet_id.title} - Mã sách: ${book.identifier_code} (Còn ${book.bookSet_id.availableCopies} quyển)`,
      book: {
        identifier_code: book.identifier_code,
        title: book.bookSet_id.title,
        author: book.bookSet_id.author,
        status: book.status,
        availableCopies: book.bookSet_id.availableCopies,
      },
    }));

    return res.status(200).json({
      message:
        formattedBooks.length > 0
          ? "Tìm kiếm sách thành công"
          : "Không tìm thấy sách có sẵn",
      data: formattedBooks,
    });
  } catch (error) {
    console.error("Error in searchBooksByTitle:", error);
    return res.status(500).json({
      message: "Lỗi server: " + error.message,
      data: [],
    });
  }
};

const BookController = {
  updateBook,
  deleteBook,
  getBookDetail,
  listBooks,
  getBookSetDetails,
  searchBookByIdentifier,
  searchBooksByTitle,
};
module.exports = BookController;
