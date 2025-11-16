import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { response } from "../utils/response";
import { productsIndexClient } from "../clients/productsIndexClient";

export async function handler(event: APIGatewayProxyEventV2) {
  const query = event.queryStringParameters?.query;

  if (!query) {
    return response(400, { error: "Search term is required!" });
  }

  const products = await productsIndexClient.search(query);

  const items = products.map((item) => {
    delete item._highlightResult;

    return {
      ...item,
      objectID: undefined,
    };
  });

  return response(200, { data: items });
}
