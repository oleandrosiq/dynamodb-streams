import { PutCommand } from "@aws-sdk/lib-dynamodb";
import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { randomUUID } from "node:crypto";
import { z } from "zod";

import { dynamoClient } from "../clients/dynamoClients";
import { env } from "../config/env";
import { response } from "../utils/response";

const schema = z.object({
  name: z.string().min(1),
  price: z.number(),
});

export async function handler(event: APIGatewayProxyEventV2) {
  const { success, data, error } = schema.safeParse(
    JSON.parse(event.body ?? "{}")
  );

  if (!success) {
    return response(400, { errors: error.issues });
  }

  const { name, price } = data;
  const id = randomUUID();

  const command = new PutCommand({
    TableName: env.PRODUCTS_TABLE,
    Item: {
      id,
      name,
      price,
    },
  });

  await dynamoClient.send(command);

  return response(201, { id });
}
