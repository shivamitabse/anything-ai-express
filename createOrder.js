import Razorpay from "razorpay";
import pool from "./models/db.js";

const createOrder = async (req, res) => {
  const name = req.user.email;
  const status = "not shipped";
  const payment_status = "pending";

  let instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  console.log(name);

  const products = req.body;

  const getPrice = () => {
    let totalPrice = 0;
    products.forEach((product) => {
      const priceAsString = product.price.split(".")[0];
      const priceAsInt = parseInt(priceAsString);
      totalPrice += priceAsInt;
    });
    return totalPrice;
  };
  const amount = getPrice();

  const dbResponse = await pool.execute(
    `insert into orders (user_id, total_amount,  status, payment_status) values (2, ${Number(amount.toFixed(2))},  "pending", "alsopending")`,
  );

  const orderId = dbResponse[0].insertId;

  // razorpay requesting order id

  var options = {
    amount: (amount * 100).toString(), // Amount is in currency subunits.
    currency: "INR",
    receipt: orderId.toString(),
  };

  instance.orders.create(options, async function (err, order) {
    if (err) {
      console.error("Razorpay Error:", err);
      return res.status(500).send({ error: err });
    }

    await pool.execute(
      `update orders set razorpay_order_id = "${order.id}" where id = "${orderId}"`,
    );
    console.log(order.id);

    res.send({ rpay_order_id: order.id });
  });
};

export default createOrder;
