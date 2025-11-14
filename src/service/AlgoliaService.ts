import { algoliasearch, type Algoliasearch } from "algoliasearch";

interface IUpsertParams {
  objectID: string;
  [key: string]: unknown;
}

export class AlgoliaService {
  private readonly client: Algoliasearch;

  constructor(
    private readonly indexName: string,
    applicationId: string,
    writeApiKey: string
  ) {
    this.client = algoliasearch(applicationId, writeApiKey);
  }

  // * Update or Insert
  async upsert(object: IUpsertParams) {
    await this.client.saveObject({
      indexName: this.indexName,
      body: object,
    });
  }
}
