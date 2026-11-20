import "dotenv/config";
import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

const getStripe = (): Stripe => {
  if (!stripeInstance) {
    const APIKEY = process.env.STRIPE_SECRET_KEY;
    if (!APIKEY) {
      throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
    }
    stripeInstance = new Stripe(APIKEY);
  }
  return stripeInstance;
};

const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const instance = getStripe();
    const value = (instance as any)[prop];
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export default stripe;
