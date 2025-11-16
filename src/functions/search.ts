import type { APIGatewayProxyEventV2 } from "aws-lambda";
import z from "zod";

import { response } from "../utils/response";
import { productsIndexClient } from "../clients/productsIndexClient";

const schema = z.object({
  query: z.string().min(1, "Query must be at least 1 character"),
  page: z.coerce.number().min(1, "Page must be at least 1").default(1),
  perPage: z.coerce
    .number()
    .min(1, "Items per page must be at least 1")
    .max(20, "Items per page must be at most 20")
    .default(10),
});

export async function handler(event: APIGatewayProxyEventV2) {
  const { success, error, data } = schema.safeParse(
    event.queryStringParameters
  );

  if (!success) {
    return response(400, { errors: error.issues });
  }

  const { query, page, perPage } = data;

  const {
    hits: products,
    totalItems,
    totalPages,
  } = await productsIndexClient.search({
    query,
    page: page - 1,
    perPage,
  });

  const items = products.map((item) => {
    delete item._highlightResult;

    return {
      ...item,
      objectID: undefined,
    };
  });

  return response(200, { data: items, totalItems, totalPages });
}
