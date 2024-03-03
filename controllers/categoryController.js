const Category = require("../models/Category");

const createCategory = async (req, res) => {
  try {
    // console.log(req.file)
    // console.log(req.body)
    // console.log(req.user)
    const { name } = req.body;
    const categoryExist = await Category.findOne({ name: name });
    if (categoryExist) {
      return res.status(406).json({
        status: false,
        message: "Category already exist",
      });
    }
    const category = await Category.create({
      name: name,
      user: req.user,
      image: req.file.path,
    });
    return res.status(201).json({
      status: true,
      message: "Category created",
      category,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

const categoryList = async (req, res) => {
  try {
    const category = await Category.find();
    if (category.length > 0) {
      return res.status(200).json({
        status: true,
        category,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "No category found",
      });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({
      status: false,
      message: "Some thing went wrong",
    });
  }
};

const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      return res.status(200).json({
        status: true,
        category,
      });
    } else {
      return res.status(200).json({
        status: false,
        message: "Not found",
      });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({
      status: false,
      message: "Some thing went wrong",
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (category) {
      return res.status(200).json({
        status: true,
        category,
      });
    } else {
      return res.status(200).json({
        status: false,
        message: "update failed",
      });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({
      status: false,
      message: "Some thing went wrong",
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category.length > 0) {
      return res.status(400).json({
        status: false,
        message: "Category have Some products can't delete",
      });
    }
    await Category.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      status: true,
      message: "Deleted Successfully",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({
      status: false,
      message: "Some thing went wrong",
    });
  }
};

module.exports = {
  createCategory,
  categoryList,
  getCategory,
  updateCategory,
  deleteCategory,
};
