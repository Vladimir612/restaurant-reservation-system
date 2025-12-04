import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

export const graphqlConfig: ApolloDriverConfig = {
  driver: ApolloDriver,
  autoSchemaFile: join(process.cwd(), 'schema.gql'),
  sortSchema: true,
  playground: true,
  buildSchemaOptions: {
    dateScalarMode: 'isoDate',
    numberScalarMode: 'integer',
  },
  fieldResolverEnhancers: ['guards', 'interceptors'],
};
