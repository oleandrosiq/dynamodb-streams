import type { AttributeValue } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import type { DynamoDBRecord, DynamoDBStreamEvent } from "aws-lambda";
import { AlgoliaService } from "../service/AlgoliaService";
import { env } from "../config/env";

const productsIndex = new AlgoliaService(
  "products",
  env.ALGOLIA_APP_ID,
  env.ALGOLIA_API_KEY
);

export async function handler(event: DynamoDBStreamEvent) {
  await Promise.all(
    event.Records.map(async (record) => {
      const upsertEvents: DynamoDBRecord["eventName"][] = ["INSERT", "MODIFY"];

      if (
        upsertEvents.includes(record.eventName) &&
        record.dynamodb?.NewImage
      ) {
        const newObject = record.dynamodb.NewImage as Record<
          string,
          AttributeValue
        >;
        const object = unmarshall(newObject);

        await productsIndex.upsert({
          objectID: object.id,
          ...object,
        });
      }
    })
  );
}
