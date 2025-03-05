const { default: mongoose } = require("mongoose");
const axios = require("axios");
const db = require("../models");
const {
  user: User,
  role: Role,
  fines: Fines,
  order: Order,
  penaltyreason: PenaltyReason,
  book: Book,
  notification: Notification,
  bookset: BookSet,
} = db;
const nodemailer = require("nodemailer");

//for send email
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "",
    pass: "",
  },
});

//get All fines
const getAllFines = async (req, res, next) => {
    try {
      const fines = await Fines.find({})
        .populate("user_id")
        .populate({
          path: "book_id",
          populate: {
            path: "bookSet_id",
          },
        })
        .populate("order_id")
        .populate("fineReason_id")
        .populate("createBy")
        .populate("updateBy");
  
      if (!fines || fines.length === 0) {
        return res.status(500).json({
          message: "Get all fines failed",
          data: [],
        });
      }
  
      res.status(200).json({
        message: "Get all fines successfully",
        data: fines,
      });
    } catch (error) {
      console.error("Error listing fines", error);
      res.status(500).send({ message: error.message });
    }
  };
  

const FinesController = {
    getAllFines
  };
  module.exports = FinesController;
  