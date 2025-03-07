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

//get fines by id
const getFinesById = async (req, res, next) => {
  try {
    const { finesId } = req.params;
    const fines = await Fines.findById(finesId)
      .populate("user_id")
      .populate("book_id")
      .populate("order_id")
      .populate("fineReason_id")
      .populate("createBy")
      .populate("updateBy");
    if (!fines) {
      return res.status(500).json({
        message: "Fines not found",
        data: null,
      });
    }

    res.status(200).json({
      message: "Get fines successfully",
      data: fines,
    });
  } catch (error) {
    console.error("Error getting a fines", error);
    res.status(500).send({ message: error.message });
  }
};

//get fines by user id
const getFinesByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(500).json({
        message: "User not found",
        data: [],
      });
    }

    const fines = await Fines.find({ user_id: userId })
      .populate("user_id")
      .populate("book_id")
      .populate("order_id")
      .populate("fineReason_id")
      .populate("createBy")
      .populate("updateBy");

    res.status(200).json({
      message: "Get fines successfully",
      data: fines,
    });
  } catch (error) {
    console.error("Error getting a fines", error);
    res.status(500).send({ message: error.message });
  }
};

// get fines by user code
const getFinesByUserCode = async (req, res, next) => {
  try {
    const { userCode } = req.params;

    const user = await User.findOne({ code: { $regex: userCode, $options: "i" } });
    if (!user) {
      return res.status(500).json({
        message: "User not found",
        data: [],
      });
    }

    const fines = await Fines.find({ user_id: user._id })
      .populate({
        path: "user_id",
        select: "code fullName email",
      })
      .populate({
        path: "book_id",
        populate: {
          path: "bookSet_id",
        },
      })
      .populate({
        path: "order_id",
        select: "borrowDate dueDate returnDate",
      })
      .populate({
        path: "fineReason_id",
        select: "reasonName penaltyAmount",
      })
      .populate({
        path: "createBy",
        select: "fullName email",
      })
      .populate({
        path: "updateBy",
        select: "fullName email",
      });

    if (!fines || fines.length === 0) {
      return res.status(500).json({
        message: "No fines found for this user",
        data: [],
      });
    }

    res.status(200).json({
      message: "Get fines successfully",
      data: fines,
    });
  } catch (error) {
    console.error("Error getting fines:", error);
    res.status(500).json({ message: error.message });
  }
};

//get fines by order id
const getFinesByOrderId = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(500).json({
        message: "Order not found",
        data: [],
      });
    }

    const fines = await Fines.find({ order_id: orderId })
      .populate("user_id")
      .populate("book_id")
      .populate("order_id")
      .populate("fineReason_id")
      .populate("createBy")
      .populate("updateBy");

    res.status(200).json({
      message: "Get fines successfully",
      data: fines,
    });
  } catch (error) {
    console.error("Error getting a fines", error);
    res.status(500).send({ message: error.message });
  }
};

  

const FinesController = {
    getAllFines,
    getFinesById,
    getFinesByUserId,
    getFinesByUserCode,
    getFinesByOrderId
  };
  module.exports = FinesController;
  