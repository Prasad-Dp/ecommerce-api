const Brand = require("../models/Brand");

const createBrand = async (req, res) => {
  try {
    const { name } = req.body;
    const brandExist = await Brand.findOne({ name: name });
    if (brandExist) {
      return res.status(406).json({
        status: false,
        message: "Brand already exists",
      });
    }
    const brand = await Brand.create({
      name: name,
      user: req.user,
      image: req.file.path,
    });
    return res.status(200).json({
      status: true,
      message: "new brand added",
      brand,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

const brandList = async (req, res) => {
  try {
    const brands = await Brand.find();
    if (brands.length > 0) {
      return res.status(200).json({
        status: true,
        brands,
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

const getBrand = async (req, res) => {
  try {
    const brandExist = await Brand.findById(req.params.id);
    if (brandExist) {
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

const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (brand) {
      return res.status(200).json({
        status: true,
        message: "Upadted Successfully",
        brand,
      });
    }
    return res.status(200).json({
      status: true,
      message: "Upadte failed",
      brand,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (brand?.products?.length > 0) {
      return res.status(400).json({
        status: false,
        message: "Brand have some products can't delete",
      });
    }
    await Brand.findByIdAndDelete(req.params.id);
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
  createBrand,
  brandList,
  getBrand,
  updateBrand,
  deleteBrand,
};
