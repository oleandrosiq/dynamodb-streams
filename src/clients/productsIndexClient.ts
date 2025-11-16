import { env } from "../config/env";
import { AlgoliaService } from "../service/AlgoliaService";

export const productsIndexClient = new AlgoliaService(
  "products",
  env.ALGOLIA_APP_ID,
  env.ALGOLIA_API_KEY
);
