const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema(
  {
    bookSet_id: { type: Schema.Types.ObjectId, ref: "BookSet", required: true },
    identifier_code: { type: String, required: true, unique: true },
    condition: {
      type: String,
      enum: ["Good", "Light", 'Medium', 'Hard', 'Lost'],
      required: true,
    },
    condition_detail: { type: String },
    status: {
      type: String,
      enum: ["Available", "Borrowed", 'Destroyed'],
      required: true,
    },
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updated_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
