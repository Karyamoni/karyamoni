import { gql } from "graphql-tag";

// All IKAS GraphQL operations must be defined here.
// NO inline GraphQL strings allowed anywhere else.
// Run `pnpm codegen` after every change.

export const GET_MERCHANT = gql`
  query GetMerchant {
    merchant {
      id
      name
      email
      storeUrl: url
    }
  }
`;

export const LIST_PRODUCTS = gql`
  query ListProducts($first: Int, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          id
          name
          categories {
            id
            name
          }
          variants {
            id
            name
            sku
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: String!) {
    product(id: $id) {
      id
      name
      categories {
        id
        name
      }
      variants {
        id
        name
        sku
        attributes {
          key
          value
        }
      }
      images {
        fileName
        order
      }
    }
  }
`;
