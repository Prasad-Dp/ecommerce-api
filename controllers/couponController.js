const Coupon = require("../models/Coupon");

const createCoupon = async (req, res) => {
  try {
    const { coupon, startDate, endDate, discount } = req.body;

    const couponExisits = await Coupon.findOne({
      coupon: coupon,
    });
    if (couponExisits) {
      return res.status(200).json({
        status: false,
        message: "coupon alreday exist",
      });
    }
    const couponData = await Coupon.create({
      coupon: coupon.toUpperCase(),
      startDate,
      endDate,
      discount,
      user: req.user,
    });
    return res.status(200).json({
      status: true,
      message: "coupon created",
      couponData,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({
      status: false,
      message: "Some thing went wrong",
    });
  }
};

const couponList = async (req, res) => {
  try {
    const coupon = await Coupon.find();
    if (coupon.length < 0) {
      return res.status(200).json({
        status: false,
        message: "no coupons found",
      });
    }
    return res.status(200).json({
      status: true,
      coupon,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({
      status: false,
      message: "Some thing went wrong",
    });
  }
};

const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ coupon: req.params.id });
    if (!coupon) {
      return res.status(400).json({
        status: false,
        message: "no coupon found",
      });
    }
    if (coupon?.isExpired) {
      return res.status(400).json({
        status: false,
        message: "coupon expired",
      });
    }

    return res.status(200).json({
      status: true,
      coupon,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({
      status: false,
      message: "Some thing went wrong",
    });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!coupon) {
      return res.status(200).json({
        status: false,
        message: "no coupon found",
      });
    }
    return res.status(200).json({
      status: true,
      coupon,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({
      status: false,
      message: "Some thing went wrong",
    });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      status: true,
      message: "deleted",
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
  createCoupon,
  couponList,
  getCoupon,
  updateCoupon,
  deleteCoupon,
};
