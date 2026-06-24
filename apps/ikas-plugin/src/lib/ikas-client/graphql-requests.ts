import { gql } from "graphql-tag";

// All IKAS GraphQL operations must be defined here.
// NO inline GraphQL strings allowed anywhere else.
// Run `pnpm codegen` after every change.

export const GET_MERCHANT = gql`
  query GetMerchant {
    getMerchant {
      id
      merchantName
      email
      storeName
    }
  }
`;

export const LIST_PRODUCTS = gql`
  query ListProducts($limit: Int, $page: Int) {
    listProduct(pagination: { limit: $limit, page: $page }) {
      count
      hasNext
      page
      data {
        id
        name
        categories {
          id
          name
        }
        variants {
          id
          sku
          images {
            imageId
            isMain
            order
          }
        }
      }
    }
  }
`;

// saveProduct(input: ProductInput!): Product — IKAS Admin GraphQL v2
// Used to write custom attributes (e.g., 3d_model_url) back to IKAS catalog.
export const SAVE_PRODUCT_3D_URL = gql`
  mutation SaveProduct3dUrl($input: ProductInput!) {
    saveProduct(input: $input) {
      id
      attributes {
        attributeId
        value
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: StringFilterInput) {
    listProduct(id: $id, pagination: { limit: 1, page: 1 }) {
      data {
        id
        name
        categories {
          id
          name
        }
        variants {
          id
          sku
          images {
            imageId
            isMain
            order
          }
        }
      }
    }
  }
`;
