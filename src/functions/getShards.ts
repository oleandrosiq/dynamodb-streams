import {
  DescribeStreamCommand,
  GetRecordsCommand,
  GetShardIteratorCommand,
} from "@aws-sdk/client-dynamodb-streams";
import { env } from "../config/env";
import { response } from "../utils/response";
import { dynamoStreamClient } from "../clients/dynamoClients";

export async function handler() {
  const describeStreamCommand = new DescribeStreamCommand({
    StreamArn: env.PRODUCTS_TABLE_STREAM,
  });

  const { StreamDescription } = await dynamoStreamClient.send(
    describeStreamCommand
  );
  const shards = StreamDescription?.Shards;

  if (!shards || shards.length === 0) {
    return response(204);
  }

  const data = await Promise.all(
    shards.map(async (shard) => {
      const getShardIteratorCommand = new GetShardIteratorCommand({
        StreamArn: env.PRODUCTS_TABLE_STREAM,
        ShardId: shard.ShardId,
        ShardIteratorType: "TRIM_HORIZON",
      });

      const { ShardIterator } = await dynamoStreamClient.send(
        getShardIteratorCommand
      );

      if (!ShardIterator) {
        return [];
      }

      const getRecordsCommand = new GetRecordsCommand({ ShardIterator });

      const { Records } = await dynamoStreamClient.send(getRecordsCommand);

      return Records ?? [];
    })
  );

  return response(200, {
    shards: shards.length,
    data: data.flat(),
  });
}
