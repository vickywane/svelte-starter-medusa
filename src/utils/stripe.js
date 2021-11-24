/**
 * This is a singleton to ensure we only instantiate Stripe once.
 */
import { loadStripe } from "@stripe/stripe-js";
import { STRIPE_KEY } from '../../creds'

let stripePromise;

const getStripe = () => {
    stripePromise = loadStripe(STRIPE_KEY);
    return stripePromise;
};

export default getStripe;
