import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";

const webhookVerification = (req, res) => {

const result = validateWebhookSignature(JSON.stringify(req.body), req.headers["x-razorpay-signature"], process.env.WEBHOOK_SECRET);

console.log("result is", result)

console.log(req.headers["x-razorpay-signature"])

if(result){
return res.status(200).json({ status: "ok" });
}
else{
return res.status(400).json({ status: "invalid signature" });
}

}

export default webhookVerification
