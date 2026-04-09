import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import pool from "./models/db.js";
const secret = process.env.RAZORPAY_KEY_SECRET;
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_KEY);

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

  console.log(dbResponse);

  // also update the transaction id in the orders table

  if (isValid) {
    (async function () {
      const { data, error } = await resend.emails.send({
        from: "TestMySiteAdmin <admin@testmysite.in>",
        to: ["srinavya962@gmail.com"],
        subject: `payment for order no: ${dbResponse[0][0].id}`,
        html: "<strong>Your order was successfully placed</strong>",
      });

      if (error) {
        return console.error({ error });
      }

      console.log({ data });
    })();

    res.json({ success: true });
  }
};

export default paymentVerification;
