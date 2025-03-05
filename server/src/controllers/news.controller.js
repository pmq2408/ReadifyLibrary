const { default: mongoose } = require("mongoose");
const db = require("../models");
const { user: User, news: News } = db;
const { GridFSBucket } = require("mongodb");


//list news
async function listNews(req, res, next) {
    try {
      const news = await News.find();
      res.status(200).json({
        message: "Get news successfully",
        data: news,
      });
    } catch (error) {
      console.error("Error getting news", error);
      res.status(500).send({ message: error.message });
    }
  }

  const NewsController = {
    listNews
  };
  module.exports = NewsController;