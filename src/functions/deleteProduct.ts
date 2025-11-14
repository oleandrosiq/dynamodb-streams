import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import type { APIGatewayProxyEventV2 } from "aws-lambda";

import { dynamoClient } from "../clients/dynamoClients";
import { env } from "../config/env";
import { response } from "../utils/response";

export async function handler(event: APIGatewayProxyEventV2) {
  const id = event.pathParameters?.productId;

  if (!id) {
    return response(404, { error: "Product not found." });
  }

  const command = new DeleteCommand({
    TableName: env.PRODUCTS_TABLE,
    Key: { id },
  });

  await dynamoClient.send(command);

  return response(204);
}
