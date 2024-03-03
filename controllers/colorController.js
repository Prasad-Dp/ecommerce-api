const Color = require("../models/Color");

const createColorCtrl = async (req, res) => {
  try {
    const colorExist = await Color.findOne({ color: req.body.color });
    if (colorExist) {
      return res.status(400).json({
        status: false,
        message: "Color already exist",
      });
    }
    const color = await Color.create({
      color: req.body.color,
      user: req.user,
    });
    return res.status(200).json({
      status: true,
      message: "new color added",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({
      status: false,
      message: "Some thing went wrong",
    });
  }
};

const colorList = async (req, res) => {
  try {
    const color = await Color.find();
    if (color.length > 0) {
      return res.status(200).json({
        status: true,
        color,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "No data found",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

const getColor = async (req, res) => {
  try {
    const colorExist = await Color.findById(req.params.id);
    if (colorExist) {
      return res.status(200).json({
        status: true,
        brandExist,
      });
    }
    return res.status(200).json({
      status: true,
      message: "no data found",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

const updateColor = async (req, res) => {
  try {
    const color = await Color.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (color) {
      return res.status(200).json({
        status: true,
        message: "Upadted Successfully",
        color,
      });
    }
    return res.status(200).json({
      status: true,
      message: "Upadte failed",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

const deleteColor = async (req, res) => {
  try {
    const color = await Color.findById(req.params.id);
    if (color?.length > 0) {
      return res.status(400).json({
        status: false,
        message: "color have some products can't delete",
      });
    }
    await Color.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      status: true,
      message: "Deleted Successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      status: false,
      message: "fail to delete",
    });
  }
};

module.exports = {
  createColorCtrl,
  colorList,
  getColor,
  updateColor,
  deleteColor,
};
