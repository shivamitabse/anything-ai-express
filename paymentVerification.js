import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import pool from "./models/db.js";
const secret = process.env.RAZORPAY_KEY_SECRET;

const paymentVerification = async (req, res) => {
  const dbResponse = await pool.execute(
    `select * from orders where razorpay_order_id = "${req.body.razorpay_order_id}"`,
  );

  const dbRazorpay_order_id = dbResponse[0][0].razorpay_order_id;

  const isValid = validatePaymentVerification(
    { order_id: dbRazorpay_order_id, payment_id: req.body.razorpay_payment_id },
    req.body.razorpay_signature,
    secret,
  );

  // also update the transaction id in the orders table

  if (isValid) {
    res.json({ success: true });
  }
};

export default paymentVerification;
