import { GetCommand } from "@aws-sdk/lib-dynamodb";
import type { APIGatewayProxyEventV2 } from "aws-lambda";

import { response } from "../utils/response";
import { env } from "../config/env";
import { dynamoClient } from "../clients/dynamoClients";

export async function handler(event: APIGatewayProxyEventV2) {
  const productId = event.pathParameters?.id;

  if (!productId) {
    return response(400, { error: "ProductId is required!" });
  }

  const getCommand = new GetCommand({
    TableName: env.PRODUCTS_TABLE,
    Key: { id: productId },
  });

  const { Item } = await dynamoClient.send(getCommand);

  if (!Item) {
    return response(404, { error: "Product not found!" });
  }

  return response(200, { product: Item });
}
