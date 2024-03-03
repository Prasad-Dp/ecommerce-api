const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");
const Strip = require("stripe");

const strip = new Strip(process.env.STRIPE_KEY);

const orderCtrl = async (req, res) => {
  try {
    const { orderItems, subtotal, discount, totalPrice, discountrate } =
      req.body;
    //console.log(orderItems,subtotal,discount,totalPrice,discountrate)
    //finding user
    const user = await User.findById(req.user);
    //checking orderitems empty or not
    if (orderItems.length <= 0) {
      return res.status(400).json({
        status: false,
        message: "Please select atleast 1 item to place order",
      });
    }
    //check userhas shipping address
    if (!user?.hasShippindAddress) {
      return res.status(400).json({
        status: false,
        message: "Please add shipping address",
      });
    }

    //checking coupon
    // const {coupon}=req.query
    // const couponData=await Coupon.findOne({coupon:coupon})
    // if(couponData?.isExpired){
    //     return res.status(400).json({
    //         status:false,
    //         message:"coupon exprired"
    //     })
    // }
    // if(!couponData){
    //     return res.status(400).json({
    //         status:false,
    //         message:"no coupon found"
    //     })
    // }

    // const discount=couponData?.discount/100

    //create order
    const order = await Order.create({
      user: user?._id,
      orderItems,
      shippingAddress: user?.shippingAddress,
      subtotal,
      discount,
      totalPrice, //:couponData? totalPrice-totalPrice*discount : totalPrice
    });
    //push order into user account
    user.orders.push(order?._id);
    await user.save();
    //update product qty
    const products = await Product.find({ _id: { $in: orderItems } });
    //console.log(products)
    orderItems?.map(async (order) => {
      const product = products?.find((product) => {
        return product?._id?.toString() === order?._id?.toString();
      });
      if (product) {
        product.totalSold += order.orderQty;
      }
      await product.save();
    });

    //convert orderitem data into stripe data
    const convertedOrder = orderItems.map((order) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: order?.name,
            description: order?.description,
          },
          unit_amount:
            (order?.price - (order?.price * discountrate) / 100) * 100,
        },
        quantity: order?.orderQty,
      };
    });

    //make payment
    const session = await strip.checkout.sessions.create({
      line_items: convertedOrder,
      metadata: {
        orderId: JSON.stringify(order?._id),
      },
      mode: "payment",
      success_url: "http://localhost:3000/profile/orders",
      cancel_url: "http://localhost:3000/profile/orders",
    });
    //console.log(order)
    //console.log(session.url)
    return res.status(200).json({
      status: true,
      order,
      url: session.url,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      status: false,
      message: "something went wrong",
    });
  }
};

const ordersList = async (req, res) => {
  try {
    const orders = await Order.find();
    return res.status(200).json({
      status: true,
      orders,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      status: false,
      message: "something went wrong",
    });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(200).json({
        status: false,
        message: "No data found",
      });
    }
    //console.log(order)
    return res.status(200).json({
      status: true,
      order,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      status: false,
      message: "something went wrong",
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        deliveredAt: req.body.deliveredAt,
      },
      { new: true }
    );
    if (!order) {
      return res.status(200).json({
        status: false,
        message: "No data found",
      });
    }
    return res.status(200).json({
      status: false,
      message: "updated done",
      order,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      status: false,
      message: "something went wrong",
    });
  }
};

const getSaleSum = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      {
        $group: {
          _id: null,
          minimumSales: {
            $min: "$totalPrice",
          },
          maximunSales: {
            $max: "$totalPrice",
          },
          avrageSales: {
            $avg: "$totalPrice",
          },
          totalSales: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);
    const totalorders = await Order.find().countDocuments();
    return res.status(200).json({
      status: true,
      totalOrders: totalorders,
      sales,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      status: false,
      message: "something went wrong",
    });
  }
};

const todaySales = async (req, res) => {
  try {
    const date = new Date();
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const sales = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: today,
          },
        },
      },
      {
        $group: {
          _id: null,
          minimumSales: {
            $min: "$totalPrice",
          },
          maximunSales: {
            $max: "$totalPrice",
          },
          avrageSales: {
            $avg: "$totalPrice",
          },
          totalSales: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);
    const totalorders = await Order.find().countDocuments();
    return res.status(200).json({
      status: true,
      sales,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      status: false,
      message: "something went wrong",
    });
  }
};

module.exports = {
  orderCtrl,
  ordersList,
  getOrder,
  updateOrder,
  getSaleSum,
  todaySales,
};
