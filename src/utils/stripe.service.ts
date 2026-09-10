import "dotenv/config";
import Stripe from "stripe";

const APIKEY = process.env.STRIPE_SECRET_KEY;

if (!APIKEY) {
  throw new Error("STRIPE_API_KEY is not defined in environment variables or not load");
}

const stripe = new Stripe(APIKEY);

export default stripe;