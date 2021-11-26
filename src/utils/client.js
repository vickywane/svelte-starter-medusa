import Medusa from "@medusajs/medusa-js";
import creds from '../../creds.template';

const BACKEND_URL = creds?.medusa_backend_url || "http://localhost:9000";

export const createClient = () => new Medusa({ baseUrl: BACKEND_URL });
