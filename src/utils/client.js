import Medusa from "@medusajs/medusa-js";
import { STRIPE_KEY } from '../../creds'

const BACKEND_URL = STRIPE_KEY || "http://localhost:9000";

export const createClient = () => new Medusa({ baseUrl: BACKEND_URL });
