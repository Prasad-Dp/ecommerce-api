const express = require("express");
require("dotenv").config();
const dbConnection = require("./config/dbconfig");
const userRoute = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const morgan = require("morgan");
const categoryRoutes = require("./routes/categoryRoutes");
const brandRoutes = require("./routes/brandRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const orderRoutes = require("./routes/orderRoutes");
const Order = require("./models/Order");
const Strip = require("stripe");
const couponRoutes = require("./routes/couponRoutes");
const cors = require("cors");
const colorRoutes = require("./routes/colorRoutes");

const endpointSecret = process.env.endpointSecret;

dbConnection();
const app = express();
const stripe = new Strip(process.env.STRIPE_KEY);
app.use(cors());
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    let event = request.body;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret
        );
        console.log("event");
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { orderId } = session.metadata;
      const paymentStatus = session.payment_status;
      const paymentMethod = session.payment_method_types[0];
      const totalAmount = session.amount_total;
      const currency = session.currency;

      //console.log(orderId,paymentStatus,paymentMethod,totalAmount,currency)
      const order = await Order.findByIdAndUpdate(
        JSON.parse(orderId),
        {
          totalPrice: totalAmount / 100,
          paymentStatus,
          paymentMethod,
          currency,
        },
        { new: true }
      );
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("tiny"));
app.use("/api/v1/users", userRoute);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/brand", brandRoutes);
app.use("/api/v1/review", reviewRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/colors", colorRoutes);

app.get("/", (req, res) => {
  res.sendfile('ecommerce-api.html')
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}... `);
  console.log(`http://127.0.0.1:${PORT}`);
});
