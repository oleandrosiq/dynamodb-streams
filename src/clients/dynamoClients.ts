import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBStreamsClient } from "@aws-sdk/client-dynamodb-streams";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const dynamoStreamClient = new DynamoDBStreamsClient();
