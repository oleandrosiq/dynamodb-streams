import { algoliasearch, type Algoliasearch } from "algoliasearch";

interface IUpsertParams {
  objectID: string;
  [key: string]: unknown;
}

interface ISearchParams {
  query: string;
  page: number;
  perPage: number;
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
  async search({ query, page, perPage }: ISearchParams) {
    const { hits, nbHits, nbPages } = await this.client.searchSingleIndex({
      indexName: this.indexName,
      searchParams: {
        query,
        page,
        hitsPerPage: perPage,
      },
    });

    return {
      hits,
      totalItems: nbHits,
      totalPages: nbPages,
    };
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
