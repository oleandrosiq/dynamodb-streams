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

  // * Search
  async search(query: string) {
    const { hits } = await this.client.searchSingleIndex({
      indexName: this.indexName,
      searchParams: {
        query,
      },
    });

    return hits;
  }

  // * Update or Insert
  async upsert(object: IUpsertParams) {
    await this.client.saveObject({
      indexName: this.indexName,
      body: object,
    });
  }

  // * Delete object
  async delete(objectID: string) {
    await this.client.deleteObject({
      objectID,
      indexName: this.indexName,
    });
  }
}
