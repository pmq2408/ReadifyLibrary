const { default: mongoose } = require("mongoose");
const { bookset: BookSet, book: Book, catalog: Catalog } = require("../models");
const { GridFSBucket } = require("mongodb");
const xlsx = require("xlsx");
const axios = require('axios');

async function createBookSet(req, res, next) {
  try {
    const {
      catalog_id,
      isbn,
      code,
      shelfLocationCode,
      title,
      author,
      publishedYear,
      publisher,
      physicalDescription,
      totalCopies,
      price,
      createdBy
    } = req.body;
    const image = req.file;

    if (
      !catalog_id ||
      !code ||
      !isbn ||
      !title ||
      !author ||
      !publishedYear ||
      !publisher ||
      !physicalDescription ||
      !shelfLocationCode ||
      !totalCopies ||
      !price ||
      !createdBy
    ) {
      return res
        .status(500)
        .json({ message: "Tất cả các trường đều bắt buộc phải điền." });
    }

    const catalog = await Catalog.findById(catalog_id);
    if (!catalog) {
      return res.status(404).json({ message: "Catalog not found." });
    }

    const catalogCode = catalog.code;
    var availableCopies = totalCopies;
    const newBookSet = new BookSet({
      catalog_id,
      isbn,
      code,
      shelfLocationCode,
      title,
      author,
      publishedYear,
      publisher,
      physicalDescription,
      totalCopies,
      availableCopies,
      price,
      created_by: createdBy,
      updated_by: createdBy
    });

    if (image) {
      // Sử dụng GridFS để lưu ảnh
      const bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: "uploads",
      });

      const uploadStream = bucket.openUploadStream(image.originalname);
      uploadStream.end(image.buffer);

      uploadStream.on("finish", async () => {
        newBookSet.image = `/bookset/image/${uploadStream.id}`; // Lưu đường dẫn ảnh
        await newBookSet.save();

        // Sau khi lưu BookSet, tiến hành tạo Books
        await createBooksForBookSet(newBookSet, catalogCode, code, totalCopies, createdBy);

        res.status(200).json({
          message: "BookSet and Books created successfully",
          bookSet: newBookSet,
        });
      });

      uploadStream.on("error", (err) => {
        res.status(500).json({ message: "Error uploading image", error: err });
      });
    } else {
      // Không có ảnh thì lưu ngay BookSet và tạo Books
      await newBookSet.save();

      // Tạo sách
      await createBooksForBookSet(newBookSet, catalogCode, code, totalCopies, createdBy);
      res.status(200).json({
        message: "Bộ sách và các cuốn sách đã được tạo thành công",
        bookSet: newBookSet,
      });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(500).json({
        message: "Sách với ISBN hoặc mã định danh này đã tồn tại.",
      });
    }

    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
}

async function createBooksForBookSet(bookSet, catalogCode, code, totalCopies, createdBy) {
  const books = [];
  for (let i = 0; i < totalCopies; i++) {
    let identifierCode;
    let isUnique = false;

    while (!isUnique) {
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      identifierCode = `${catalogCode}.${code}.${randomCode}`;

      const existingBook = await Book.findOne({
        identifier_code: identifierCode,
      });
      if (!existingBook) {
        isUnique = true;
      }
    }

    const newBook = new Book({
      bookSet_id: bookSet._id,
      identifier_code: identifierCode,
      condition: "Good",
      status: "Available",
      created_by: createdBy,
      updated_by: createdBy
    });

    books.push(newBook.save());
  }

  const savedBooks = await Promise.all(books);
  return savedBooks;
}

async function updateBookSet(req, res, next) {
  try {
    const { id } = req.params;
    const {
      catalog_id,
      isbn,
      code,
      shelfLocationCode,
      title,
      author,
      publishedYear,
      publisher,
      physicalDescription,
      totalCopies,
      availableCopies,
      price,
      updatedBy
    } = req.body;
    const image = req.file;

    if (
      !catalog_id ||
      !isbn ||
      !title ||
      !author ||
      !publishedYear ||
      !publisher ||
      !physicalDescription ||
      !shelfLocationCode ||
      !price ||
      !updatedBy
    ) {
      return res
        .status(500)
        .json({ message: "Tất cả các trường bắt buộc phải được điền." });
    }

    const catalog = await Catalog.findById(catalog_id);
    if (!catalog) {
      return res.status(500).json({ message: "Không tìm thấy danh mục." });
    }

    const updatedFields = {
      catalog_id,
      isbn,
      code,
      shelfLocationCode,
      title,
      author,
      publishedYear,
      publisher,
      physicalDescription,
      totalCopies,
      availableCopies,
      price,
      created_by: updatedBy,
      updated_by: updatedBy
    };

    if (image) {
      // Find the existing BookSet by its ID
      const existingBookSet = await BookSet.findById(id);
      if (!existingBookSet) {
        return res.status(500).json({ message: "BookSet not found." });
      }

      if (existingBookSet.image) {
        const bucket = new GridFSBucket(mongoose.connection.db, {
          bucketName: "uploads",
        });
        // Get the image ID from the URL and delete the image from GridFS
        const imageId = existingBookSet.image.split("/").pop();
        await bucket.delete(new mongoose.Types.ObjectId(imageId));
      }

      // Save the new image to GridFS
      const bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: "uploads",
      });

      const uploadStream = bucket.openUploadStream(image.originalname);
      uploadStream.end(image.buffer);

      uploadStream.on("finish", async () => {
        updatedFields.image = `/bookset/image/${uploadStream.id}`; // Lưu đường dẫn ảnh

        // Cập nhật BookSet với hình ảnh mới
        const updatedBookSet = await BookSet.findByIdAndUpdate(
          id,
          updatedFields,
          {
            new: true,
            runValidators: true,
          }
        );

        return res.status(200).json({
          message: "Bộ sách đã được cập nhật thành công với hình ảnh mới",
          updatedBookSet,
        });
      });

      uploadStream.on("error", (err) => {
        return res
          .status(500)
          .json({ message: "Error uploading image", error: err });
      });
    } else {
      const updatedBookSet = await BookSet.findByIdAndUpdate(
        id,
        updatedFields,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedBookSet) {
        return res.status(500).json({ message: "Không tìm thấy bộ sách." });
      }

      return res.status(200).json({
        message: "Bộ sách đã được cập nhật thành công",
        updatedBookSet,
      });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(500).json({
        message: "Bộ sách với ISBN này đã tồn tại.",
      });
    }

    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
}

// Hàm loại bỏ dấu tiếng Việt
// Hàm loại bỏ dấu tiếng Việt
function removeVietnameseDiacritics(str) {
  return str
    .normalize("NFD") // Tách các ký tự có dấu thành ký tự cơ bản + dấu
    .replace(/[\u0300-\u036f]/g, ""); // Loại bỏ dấu
}

// Hàm chuẩn hóa chuỗi (bao gồm cả việc loại bỏ dấu)
function normalizeString(str) {
  return removeVietnameseDiacritics(
    str.toLowerCase().replace(/\s+/g, " ").trim()
  );
}

async function listBookSet(req, res, next) {
  try {
    const {
      page = 1,
      limit = 10,
      title,
      author,
      pubYear,
      publisher,
      catalog_id,
      isTextbook,
    } = req.query;

    const query = {};

    if (catalog_id) {
      query.catalog_id = catalog_id;
    }

    // Lấy tất cả các bản ghi BookSet và populate catalog_id
    const allBookSets = await BookSet.find(query)
        .populate("catalog_id")
        .sort({ createdAt: -1 });

    // Chuẩn hóa các tham số tìm kiếm
    const normalizedTitle = title ? normalizeString(title) : null;
    const normalizedAuthor = author ? normalizeString(author) : null;
    const normalizedPublisher = publisher ? normalizeString(publisher) : null;

    // Lọc danh sách các bản ghi
    const filteredBookSets = allBookSets.filter((bookSet) => {
      const normalizedBookTitle = normalizeString(bookSet.title);
      const normalizedBookAuthor = normalizeString(bookSet.author);
      const normalizedBookPublisher = normalizeString(bookSet.publisher);

      const titleMatch = normalizedTitle
          ? normalizedBookTitle.includes(normalizedTitle)
          : true;
      const authorMatch = normalizedAuthor
          ? normalizedBookAuthor.includes(normalizedAuthor)
          : true;
      const publisherMatch = normalizedPublisher
          ? normalizedBookPublisher.includes(normalizedPublisher)
          : true;

      // Kiểm tra isTextbook trong catalog đã populate
      const isTextbookMatch =
          isTextbook !== undefined && isTextbook !== ""
              ? bookSet.catalog_id &&
              bookSet.catalog_id.isTextbook === parseInt(isTextbook, 10)
              : true;

      return titleMatch && authorMatch && publisherMatch && isTextbookMatch;
    });

    // Phân trang
    const skip = (page - 1) * limit;
    const paginatedBookSets = filteredBookSets.slice(
        skip,
        skip + parseInt(limit)
    );
    const totalBookSets = filteredBookSets.length;

    return res.status(200).json({
      message: "BookSets fetched successfully",
      data: paginatedBookSets,
      total: totalBookSets,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalBookSets / limit),
    });
  } catch (error) {
    return res
        .status(500)
        .json({ message: "An error occurred", error: error.message });
  }
}


async function getBookSetDetail(req, res, next) {
  try {
    const { id } = req.params;

    const bookSet = await BookSet.findById(id).populate({
      path: "catalog_id",
      model: "Catalog",
      select: "name code",
    });

    if (!bookSet) {
      return res.status(500).json({ message: "BookSet not found." });
    }

    const books = await Book.find({ bookSet_id: id });

    return res.status(200).json({ bookSet, books });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
}

const addBooks = async (req, res, next) => {
  try {
    const { bookSet_id, numberOfCopies, createdBy } = req.body;

    if (!bookSet_id || !numberOfCopies) {
      return res
        .status(500)
        .json({ message: "ID của bộ sách và số lượng bản sao là bắt buộc." });
    }

    const bookSet = await BookSet.findById(bookSet_id);
    if (!bookSet) {
      return res.status(500).json({ message: "BookSet not found." });
    }

    const catalog = await Catalog.findById(bookSet.catalog_id);
    if (!catalog) {
      return res.status(500).json({ message: "Catalog not found." });
    }

    const catalogCode = catalog.code;

    const books = [];
    for (let i = 0; i < numberOfCopies; i++) {
      let identifierCode;
      let isUnique = false;

      while (!isUnique) {
        const randomCode = Math.floor(1000 + Math.random() * 9000);
        identifierCode = `${catalogCode}.${bookSet.code}.${randomCode}`;

        const existingBook = await Book.findOne({
          identifier_code: identifierCode,
        });
        if (!existingBook) {
          isUnique = true;
        }
      }

      const newBook = new Book({
        bookSet_id: bookSet._id,
        identifier_code: identifierCode,
        condition: "Good",
        status: "Available",
        created_by: createdBy,
        updated_by: createdBy
      });

      books.push(newBook.save());
    }

    const savedBooks = await Promise.all(books);

    bookSet.totalCopies += numberOfCopies;
    bookSet.availableCopies += numberOfCopies;
    await bookSet.save();

    return res
      .status(200)
      .json({ message: "Books added successfully", books: savedBooks });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

async function deleteBookSet(req, res, next) {
  try {
    const { id } = req.params;

    const bookSet = await BookSet.findById(id);
    if (!bookSet) {
      return res.status(500).json({ message: "BookSet not found." });
    }

    await Book.deleteMany({ bookSet_id: id });

    await BookSet.findByIdAndDelete(id);

    return res
      .status(200)
      .json({
        message: "Bộ sách và các cuốn sách liên quan đã được xóa thành công.",
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
}
async function getBookSetDetailAvailable(req, res, next) {
  try {
    const { id } = req.params;

    // Fetch the BookSet by its ID
    const bookSet = await BookSet.findById(id).populate({
      path: "catalog_id",
      model: "Catalog",
      select: "name code",
    });

    if (!bookSet) {
      return res.status(500).json({ message: "BookSet not found." });
    }

    // Fetch only the books with status 'Available' for this BookSet
    const availableBooks = await Book.find({
      bookSet_id: id,
      status: "Available",
    });

    return res.status(200).json({ bookSet, availableBooks });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
}

//get image by id
const getImageById = async (req, res) => {
  const { id } = req.params;

  try {
    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });

    const downloadStream = bucket.openDownloadStream(
      new mongoose.Types.ObjectId(id)
    );

    downloadStream.on("error", (err) => {
      res.status(500).json({ message: "Image not found", error: err });
    });

    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving image", error });
  }
};

async function importBookSets(req, res, next) {
  try {
    const { catalog_id, createdBy } = req.body;
    if (!catalog_id || !createdBy) {
      return res.status(500).json({ message: "Catalog ID và CreatedBy là bắt buộc." });
    }

    // Kiểm tra catalog tồn tại
    const catalog = await Catalog.findById(catalog_id);
    if (!catalog) {
      return res.status(500).json({ message: "Catalog không tồn tại." });
    }
    const catalogCode = catalog.code;

    // Đọc file Excel
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    // Tạo GridFSBucket
    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });

    // Xử lý từng dòng và tạo hoặc cập nhật BookSet
    for (const row of rows) {
      const {
        isbn,
        code,
        shelfLocationCode,
        title,
        author,
        publishedYear,
        publisher,
        physicalDescription,
        totalCopies,
        price,
        image // Lấy URL hình ảnh từ cột image
      } = row;

      if (
          !isbn || !code || !shelfLocationCode || !title ||
          !author || !publishedYear || !publisher || !physicalDescription ||
          !totalCopies || !price
      ) {
        continue; // Bỏ qua các dòng thiếu thông tin
      }

      let bookSet = await BookSet.findOne({ isbn });
      if (bookSet) {
        // Nếu ISBN đã tồn tại, cập nhật số lượng
        bookSet.totalCopies += totalCopies;
        bookSet.availableCopies += totalCopies;
        await bookSet.save();
      } else {
        // Nếu ISBN chưa tồn tại, tạo BookSet mới
        bookSet = new BookSet({
          catalog_id,
          isbn,
          code,
          shelfLocationCode,
          title,
          author,
          publishedYear: new Date(publishedYear),
          publisher,
          physicalDescription,
          totalCopies,
          availableCopies: totalCopies,
          price,
          created_by: createdBy,
          updated_by: createdBy,
        });

        if (image) {
          // Tải ảnh từ URL và lưu vào GridFS
          const response = await axios.get(image, { responseType: 'arraybuffer' });
          const uploadStream = bucket.openUploadStream(`${isbn}-${Date.now()}.jpg`);
          uploadStream.end(response.data);

          uploadStream.on("finish", async () => {
            bookSet.image = `/bookset/image/${uploadStream.id}`; // Lưu đường dẫn ảnh
            await bookSet.save();

            // Sau khi lưu BookSet, tiến hành tạo Books
            await createBooksForBookSet(bookSet, catalogCode, code, totalCopies, createdBy);
          });

          uploadStream.on("error", (err) => {
            console.error("Error uploading image", err);
          });
        } else {
          // Nếu không có ảnh thì lưu BookSet ngay
          await bookSet.save();
          await createBooksForBookSet(bookSet, catalogCode, code, totalCopies, createdBy);
        }
      }
    }

    res.status(200).json({ message: "BookSets và Books đã được nhập thành công." });
  } catch (error) {
    res.status(500).json({ message: "Đã xảy ra lỗi", error: error.message });
  }
}




const BookSetController = {
  createBookSet,
  updateBookSet,
  listBookSet,
  getBookSetDetail,
  addBooks,
  deleteBookSet,
  getBookSetDetailAvailable,
  getImageById,
  importBookSets
};

module.exports = BookSetController;
