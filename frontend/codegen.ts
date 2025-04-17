import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  // schema: "http://localhost:8000/subgraphs/name/betting-pools",
  schema: 'https://api.studio.thegraph.com/query/105510/promptbet/version/latest',
  documents: ['app/**/*.ts(x)', 'lib/**/*.ts(x)', 'components/**/*.ts(x)', 'stories/**/*.ts(x)'],
  generates: {
    'lib/__generated__/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      },
      plugins: [],
    },
    './graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
  ignoreNoDocuments: true,
};

export default config;
