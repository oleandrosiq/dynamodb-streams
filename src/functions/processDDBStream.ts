import type { AttributeValue } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import type { DynamoDBRecord, DynamoDBStreamEvent } from "aws-lambda";

// import { productsIndexClient } from "../clients/productsIndexClient";

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

        // await productsIndexClient.upsert({
        //   objectID: object.id,
        //   ...object,
        // });
      }

      // if (record.eventName === "REMOVE" && record.dynamodb?.OldImage?.id.S) {
      //   await productsIndexClient.delete(record.dynamodb.OldImage.id.S);
      // }
    })
  );
}
