import { Injectable } from '@angular/core';
import { Client } from 'elasticsearch-browser';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ElasticsearchService {
  private client: Client;
  private queryalldocs = {
    query: {
      // match_all: {}
      match: {
        isDeleted: false,
      }
    }
  };

  constructor() {
    if (!this.client) {
      this.connect();
    }
  }

  connect() {
    this.client = new Client({
      host: environment.ELASTIC_SEARCH_ENDPOINT,
    });
  }

  isAvailable(): any {
    return this.client.ping({
      requestTimeout: Infinity,
      body: 'Turnqey'
    });
  }

  getAllDocuments(Index, Type): any {
    return this.client.search({
      index: Index,
      type: Type,
      body: this.queryalldocs,
      filterPath: ['hits.hits']
    });
  }

  getSingleDocument(Index, Type, id): any {
    return this.client.search({
      index: Index,
      type: Type,
      body: {
        query: {
          ids: { values: id }
        }
      },
      filterPath: ['hits.hits']
    });
  }

  getfilteredData(Index, Type, query, sort): any {
    return this.client.search({
      index: Index,
      type: Type,
      body: {
        query: {
          bool: {
            must: query
          }
        },
        sort
      },
      filterPath: ['hits.hits']
    });
  }

  savetestData(Index, Type, query, sort) {
    return this.client.post({
      index: Index,
      type: Type
    });
  }

  addToIndex(value): any {
    return this.client.create(value);
  }

  // {
  //   "query": {
  //         "query_string" : {
  //             "fields" : ["sale_lease", "zip"],
  //             "query" : "(lease) AND (700157)"
  //             }
  //     }
  // }

}

