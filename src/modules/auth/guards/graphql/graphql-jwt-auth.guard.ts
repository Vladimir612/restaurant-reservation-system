import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtAuthGuard } from '../jwt-auth.guard';

interface GraphQLContext {
  req: Request;
}

@Injectable()
export class GraphqlJwtAuthGuard extends JwtAuthGuard {
  getRequest(context: ExecutionContext): Request {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext<GraphQLContext>();
    return gqlContext.req;
  }
}
