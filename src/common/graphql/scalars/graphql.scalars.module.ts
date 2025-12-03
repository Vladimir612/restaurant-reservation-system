import { Global, Module } from '@nestjs/common';
import { DateTimeUtcScalar } from 'src/common/graphql/scalars/datetime-utc.scalar';

@Module({
  providers: [DateTimeUtcScalar],
  exports: [DateTimeUtcScalar],
})
export class GraphqlScalarsModule {}
