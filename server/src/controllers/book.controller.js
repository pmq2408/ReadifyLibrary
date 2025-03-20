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
    if(book.status !== 'Destroyed' && (condition === 'Lost' || condition === 'Hard')) {
      const bookSet = await BookSet.findById(book.bookSet_id);
      bookSet.availableCopies -= 1;
      bookSet.save();
      update_status = 'Destroyed';
    }
    if(book.status === 'Destroyed' && (condition === 'Good' || condition === 'Light' || condition === 'Medium')) {
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
    if(book.condition !== 'Hard' && book.condition !== 'Lost') {
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
    const { condition, status, bookSet_id, identifier_code, page = 1, limit = 10 } = req.body;
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
        .populate('bookSet_id', 'title') // Populate để lấy thông tin tiêu đề của bộ sách nếu cần
        .populate('created_by', 'name') // Populate thông tin người tạo nếu cần
        .populate('updated_by', 'name') // Populate thông tin người cập nhật nếu cần
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


const borrowedStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      // First lookup to get book information
      {
        $lookup: {
          from: "books",
          localField: "book_id",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" },
      {
        $lookup: {
          from: "booksets",
          localField: "book.bookSet_id",
          foreignField: "_id",
          as: "bookSet",
        },
      },
      { $unwind: "$bookSet" },
      {
        $group: {
          _id: "$bookSet._id",
          title: { $first: "$bookSet.title" },
          totalCopies: { $first: "$bookSet.totalCopies" },
          // Count all orders including Lost status
          totalOrders: { $sum: 1 },
          // Count total successful borrows
          totalBorrowCount: {
            $sum: {
              $cond: {
                if: {
                  $and: [
                    { $ne: ["$status", "Pending"] },
                    { $ne: ["$status", "Rejected"] },
                    { $ne: ["$status", "Canceled"] },
                  ],
                },
                then: 1,
                else: 0,
              },
            },
          },
          // Count currently borrowed books
          currentlyBorrowed: {
            $sum: {
              $cond: {
                if: {
                  $in: ["$status", ["Approved", "Received", "Overdue", "Renew Pending"]],
                },
                then: 1,
                else: 0,
              },
            },
          },
          // Count lost books
          lostBooks: {
            $sum: {
              $cond: [{ $eq: ["$status", "Lost"] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          totalCopies: 1,
          totalOrders: 1,
          totalBorrowCount: 1,
          currentlyBorrowed: 1,
          lostBooks: 1,
          availableCopies: {
            $subtract: ["$totalCopies", { $add: ["$currentlyBorrowed", "$lostBooks"] }],
          },
        },
      },
      // Sort by total orders in descending order to show most borrowed books
      { $sort: { totalOrders: -1 } },
    ]);

    // Find the most borrowed book
    const mostBorrowedBook = stats.reduce((prev, current) => {
      return (prev.totalBorrowCount > current.totalBorrowCount) ? prev : current;
    }, stats[0]);

    return res.status(200).json({
      message: "Book borrowing statistics retrieved successfully",
      mostBorrowedBook: {
        title: mostBorrowedBook.title,
        totalBorrowCount: mostBorrowedBook.totalBorrowCount,
        borrowRate: ((mostBorrowedBook.totalBorrowCount / mostBorrowedBook.totalCopies) * 100).toFixed(2) + "%",
      },
      stats: stats.map((book) => ({
        ...book,
        borrowRate: ((book.totalBorrowCount / book.totalCopies) * 100).toFixed(2) + "%",
        totalBorrowRate: ((book.totalOrders / book.totalCopies) * 100).toFixed(2) + "%",
      })),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving borrowing statistics",
      error: error.message,
    });
  }
};

const getBookSetDetails = async (req, res) => {
  try {
    const books = await BookSet.find({}, "title totalCopies availableCopies price");

    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching book details:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


const BookController = {
  updateBook,
  deleteBook,
  getBookDetail,
  listBooks,
  borrowedStats,
  getBookSetDetails
};
module.exports = BookController;
