import { parse } from 'graphql';

import mergeTypes from '../src/merge_types';
import clientType from './graphql/types/client_type';
import productType from './graphql/types/product_type';
import vendorType from './graphql/types/vendor_type';
import personEntityType from './graphql/types/person_entity_type';
import personSearchType from './graphql/types/person_search_type';
import customType from './graphql/other/custom_type';
import disjointCustomTypes from './graphql/other/custom_type/disjoint';
import matchingCustomTypes from './graphql/other/custom_type/matching';
import conflictingCustomTypes from './graphql/other/custom_type/conflicting';

import simpleQueryType from './graphql/other/simple_query_type';
import disjointQueryTypes from './graphql/other/query_type/disjoint';
import matchingQueryTypes from './graphql/other/query_type/matching';
import conflictingQueryTypes from './graphql/other/query_type/conflicting';

const normalizeWhitespace = str => str.replace(/\s+/g, ' ').trim();

describe('mergeTypes', () => {
  describe('when no types exist', () => {
    it('returns minimal schema', () => {
      const types = [];
      const mergedTypes = mergeTypes(types);
      const expectedSchemaType = normalizeWhitespace(`
        schema {
          query: Query
        }
      `);
      const schema = normalizeWhitespace(mergedTypes);

      expect(schema).toContain(expectedSchemaType);
    });

    it('returns empty query type', () => {
      const types = [];
      const mergedTypes = mergeTypes(types);
      const expectedSchemaType = normalizeWhitespace(`
        type Query {
        }
      `);
      const schema = normalizeWhitespace(mergedTypes);

      expect(schema).not.toContain(expectedSchemaType);
    });

    it('returns no mutation type', () => {
      const types = [];
      const mergedTypes = mergeTypes(types);
      const expectedSchemaType = normalizeWhitespace(`
        type Mutation {
        }
      `);
      const schema = normalizeWhitespace(mergedTypes);

      expect(schema).not.toContain(expectedSchemaType);
    });

    it('returns no subscription type', () => {
      const types = [];
      const mergedTypes = mergeTypes(types);
      const expectedSchemaType = normalizeWhitespace(`
        type Subscription {
        }
      `);
      const schema = normalizeWhitespace(mergedTypes);

      expect(schema).not.toContain(expectedSchemaType);
    });
  });

  describe('when only query is specified', () => {
    it('returns minimal schema', () => {
      const types = [simpleQueryType];
      const mergedTypes = mergeTypes(types);
      const expectedSchemaType = normalizeWhitespace(`
        schema {
          query: Query
        }
      `);
      const schema = normalizeWhitespace(mergedTypes);

      expect(schema).toContain(expectedSchemaType);
    });

    it('returns simple query type', () => {
      const types = [simpleQueryType];
      const mergedTypes = mergeTypes(types);
      const expectedSchemaType = normalizeWhitespace(`
        type Query {
          clients: [Client]
        }
      `);
      const schema = normalizeWhitespace(mergedTypes);

      expect(schema).toContain(expectedSchemaType);
    });

    it('returns no mutation type', () => {
      const types = [simpleQueryType];
      const mergedTypes = mergeTypes(types);
      const expectedSchemaType = normalizeWhitespace(`
        type Mutation {
        }
      `);
      const schema = normalizeWhitespace(mergedTypes);

      expect(schema).not.toContain(expectedSchemaType);
    });

    it('returns no subscription type', () => {
      const types = [simpleQueryType];
      const mergedTypes = mergeTypes(types);
      const expectedSchemaType = normalizeWhitespace(`
        type Subscription {
        }
      `);
      const schema = normalizeWhitespace(mergedTypes);

      expect(schema).not.toContain(expectedSchemaType);
    });
  });

  describe('when query type is present twice', () => {
    it('merges disjoint query types', () => {
      const types = [disjointQueryTypes];
      const mergedTypes = mergeTypes(types);
      const expectedSchemaType = normalizeWhitespace(`
        type Query {
          getClient(id: ID!): Client
          deleteClient(id: ID!): Client
        }
      `);
      const separateTypes = normalizeWhitespace(mergedTypes);
      expect(separateTypes).toContain(expectedSchemaType);
    });

    it('merges query types with matching definitions', () => {
      const types = [matchingQueryTypes];
      const mergedTypes = mergeTypes(types);
      const expectedSchemaType = normalizeWhitespace(`
        type Query {
          getClient(id: ID!): Client
          deleteClient(id: ID!): Client
        }
      `);
      const separateTypes = normalizeWhitespace(mergedTypes);
      expect(separateTypes).toContain(expectedSchemaType);
    });

    it('throws on query types with conflicting definitions', () => {
      const types = [conflictingQueryTypes];
      expect(() => {
        mergeTypes(types);
      }).toThrow(expect.any(Error));
    });
  });

  describe('when only single custom type is passed', () => {
    it('includes custom type', () => {
      const types = [customType];
      const mergedTypes = mergeTypes(types);
      const expectedCustomType = normalizeWhitespace(`
        type Custom {
          id: ID!
          name: String
          age: Int
        }
      `);
      const separateTypes = normalizeWhitespace(mergedTypes);

      expect(separateTypes).toContain(expectedCustomType);
    });

    it('returns minimal schema', () => {
      const types = [customType];
      const mergedTypes = mergeTypes(types);
      const expectedSchemaType = normalizeWhitespace(`
        schema {
          query: Query
        }
      `);
      const schema = normalizeWhitespace(mergedTypes);

      expect(schema).toContain(expectedSchemaType);
    });

    it('returns empty query type', () => {
      const types = [customType];
      const mergedTypes = mergeTypes(types);
      const expectedSchemaType = normalizeWhitespace(`
        type Query {
        }
      `);
      const schema = normalizeWhitespace(mergedTypes);

      expect(schema).not.toContain(expectedSchemaType);
    });

    it('returns no mutation type', () => {
      const types = [customType];
      const mergedTypes = mergeTypes(types);
      const expectedSchemaType = normalizeWhitespace(`
        type Mutation {
        }
      `);
      const schema = normalizeWhitespace(mergedTypes);

      expect(schema).not.toContain(expectedSchemaType);
    });

    it('returns no subscription type', () => {
      const types = [customType];
      const mergedTypes = mergeTypes(types);
      const expectedSchemaType = normalizeWhitespace(`
        type Subscription {
        }
      `);
      const schema = normalizeWhitespace(mergedTypes);

      expect(schema).not.toContain(expectedSchemaType);
    });
  });

  describe('when custom type is present twice', () => {
    it('merges disjoint custom types', () => {
      const types = [disjointCustomTypes];
      const mergedTypes = mergeTypes(types, { all: true });
      const expectedCustomType = normalizeWhitespace(`
        type Custom {
          id: ID!
          name: String
          age: Int
        }
      `);
      const separateTypes = normalizeWhitespace(mergedTypes);
      expect(separateTypes).toContain(expectedCustomType);
    });

    it('merges custom types with matching definitions', () => {
      const types = [matchingCustomTypes];
      const mergedTypes = mergeTypes(types, { all: true });
      const expectedCustomType = normalizeWhitespace(`
        type Custom {
          id: ID!
          age: Int
          name: String
        }
      `);
      const separateTypes = normalizeWhitespace(mergedTypes);
      expect(separateTypes).toContain(expectedCustomType);
    });

    it('throws on custom types with conflicting definitions', () => {
      const types = [conflictingCustomTypes];
      expect(() => {
        mergeTypes(types, { all: true });
      }).toThrow(expect.any(Error));
    });
  });

  it('includes schemaType', () => {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedSchemaType = normalizeWhitespace(`
      schema {
        query: Query
        mutation: Mutation
        subscription: Subscription
      }
    `);
    const schema = normalizeWhitespace(mergedTypes);

    expect(schema).toContain(expectedSchemaType);
  });

  it('includes one schemaType on multiple merges', () => {
    const matchSchema = /\s*schema\s+\{[^\}]+\}/gm;
    const types = mergeTypes([clientType, productType]);
    const multipleMergedTypes = mergeTypes([types, vendorType]);
    const expectedSchemaType = normalizeWhitespace(`
      schema {
        query: Query
        mutation: Mutation
        subscription: Subscription
      }
    `);
    const schema = normalizeWhitespace(multipleMergedTypes);

    const matches = schema.match(matchSchema);

    expect(schema).toContain(expectedSchemaType);
    expect(matches.length).toEqual(1);
  });

  it('includes queryType', () => {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedQueryType = normalizeWhitespace(`
      type Query {
        clients: [Client]
        client(id: ID!): Client
        products: [Product]
        product(id: ID!): Product
      }
    `);
    const schema = normalizeWhitespace(mergedTypes);

    expect(schema).toContain(expectedQueryType);
  });

  it('includes mutationType', () => {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedMutationType = normalizeWhitespace(`
      type Mutation {
        create_client(name: String!, age: Int!): Client
        update_client(id: ID!, name: String!, age: Int!): Client
        create_product(description: String!, price: Int!): Product
        update_product(id: ID!, description: String!, price: Int!): Product
      }`);
    const schema = normalizeWhitespace(mergedTypes);

    expect(schema).toContain(expectedMutationType);
  });

  it('includes subscriptionType', () => {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedSubscriptionType = normalizeWhitespace(`
      type Subscription {
        activeClients: [Client]
        inactiveClients: [Client]
        activeProducts: [Product]
      }`);
    const schema = normalizeWhitespace(mergedTypes);

    expect(schema).toContain(expectedSubscriptionType);
  });

  it('includes clientType', () => {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedClientType = normalizeWhitespace(`
      type Client {
        id: ID!
        name: String
        age: Int
        dob: Date
        settings: JSON
        products: [Product]
      }
    `);
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedClientType);
  });

  it('includes productType', () => {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedProductType = normalizeWhitespace(`
      type Product {
        id: ID!
        description: String
        price: Int
        tag: TAG
        clients: [Client]
      }
    `);
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedProductType);
  });

  it('includes first inputType', () => {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedProductType = normalizeWhitespace(`
      input ClientForm {
        name: String!
        age: Int!
      }
    `);
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedProductType);
  });

  it('includes second inputType', () => {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedProductType = normalizeWhitespace(`
      input ClientAgeForm {
        age: Int!
      }
    `);
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedProductType);
  });

  it('includes first product ENUM type', () => {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedEnumType = normalizeWhitespace(`
      enum ProductTypes {
        NEW
        USED
        REFURBISHED
      }
    `);
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedEnumType);
  });

  it('includes second product ENUM type', () => {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedEnumType = normalizeWhitespace(`
      enum ProductPriceType {
        REGULAR
        PROMOTION
        SALE
      }
    `);
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedEnumType);
  });

  it('includes first client ENUM type', () => {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedEnumType = normalizeWhitespace(`
      enum ClientStatus {
        NEW
        ACTIVE
        INACTIVE
      }
    `);
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedEnumType);
  });

  it('includes first client SCALAR type', () => {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedScalarType = normalizeWhitespace(`
      scalar Date
    `);
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedScalarType);
  });

  it('includes second client SCALAR type', () => {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedScalarType = normalizeWhitespace(`
      scalar JSON
    `);
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedScalarType);
  });

  it('includes first product SCALAR type', () => {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedScalarType = normalizeWhitespace(`
      scalar TAG
    `);
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedScalarType);
  });

  it('includes INTERFACE type', () => {
    const types = [clientType, productType, vendorType, personEntityType];
    const mergedTypes = mergeTypes(types);
    const expectedScalarType = normalizeWhitespace(`
      interface PersonEntity {
          name: String
          age: Int
          dob: Date
      }
    `);
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedScalarType);
  });

  it('includes vendor custom type', () => {
    const types = [clientType, productType, vendorType, personEntityType];
    const mergedTypes = mergeTypes(types);
    const expectedScalarType = normalizeWhitespace(`
      type Vendor implements PersonEntity {
        id: ID!
        name: String
        age: Int
        dob: Date
      }
    `);
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedScalarType);
  });

  it('includes UNION type', () => {
    const types = [clientType, productType, vendorType, personEntityType, personSearchType];
    const mergedTypes = mergeTypes(types);
    const expectedScalarType = normalizeWhitespace(`
      union personSearch = Client | Vendor
    `);
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedScalarType);
  });

  it('preserves the field comments', () => {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedClientType = normalizeWhitespace(`
      type ClientWithComment {
        # ClientID
        # Second comment line
        # Third comment line
        # Fourth comment line
        id: ID!
        # Name
        name: String
      }
    `);
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedClientType);
  });

  it('preserves the type comments', () => {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedClientType = normalizeWhitespace(`
      # Comments on top of type definition
      # Second comment line
      # Third comment line
      # Fourth comment line
      type ClientWithCommentOnTop {
        # ClientID
        id: ID!
        # Name
        name: String
      }
    `);
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedClientType);
  });

  it('preserves the input field comments', () => {
    const types = [clientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedClientType = normalizeWhitespace(`
      input ClientFormInputWithComment {
        # Name
        name: String!
        # Age
        age: Int!
      }
    `);
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedClientType);
  });

  it('supports already parsed documents', () => {
    const parsedClientType = parse(clientType);
    const types = [parsedClientType, productType];
    const mergedTypes = mergeTypes(types);
    const expectedClientType = normalizeWhitespace(`
      input ClientFormInputWithComment {
        # Name
        name: String!
        # Age
        age: Int!
      }
    `);
    const separateTypes = normalizeWhitespace(mergedTypes);

    expect(separateTypes).toContain(expectedClientType);
  });
});
