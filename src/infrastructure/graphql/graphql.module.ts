import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { graphqlConfig } from './graphql.config';

@Module({
  imports: [GraphQLModule.forRoot<ApolloDriverConfig>(graphqlConfig)],
})
export class GraphqlInfraModule {}
