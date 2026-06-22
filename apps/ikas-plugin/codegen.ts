import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: process.env.NEXT_PUBLIC_GRAPH_API_URL,
  documents: ["src/lib/ikas-client/graphql-requests.ts"],
  generates: {
    "src/lib/ikas-client/__generated__/": {
      preset: "client",
      presetConfig: {
        gqlTagName: "gql",
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
