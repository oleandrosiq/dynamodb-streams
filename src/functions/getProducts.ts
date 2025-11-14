import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { response } from "../utils/response";
import { env } from "../config/env";
import { dynamoClient } from "../clients/dynamoClients";

export async function handler() {
  const scanCommand = new ScanCommand({
    TableName: env.PRODUCTS_TABLE,
  });

  const { Items } = await dynamoClient.send(scanCommand);

  return response(200, { products: Items });
}
