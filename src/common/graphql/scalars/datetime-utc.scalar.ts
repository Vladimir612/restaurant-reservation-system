import { CustomScalar, Scalar } from '@nestjs/graphql';
import { ValueNode, Kind } from 'graphql';

@Scalar('DateTimeUtc', () => Date)
export class DateTimeUtcScalar implements CustomScalar<string, Date> {
  description =
    'Strict UTC ISO DateTime scalar. Must be ISO8601 string ending with Z (e.g. 2025-04-05T18:00:00Z).';

  parseValue(value: unknown): Date {
    if (typeof value !== 'string')
      throw new Error('DateTimeUTC must be a string');

    if (!value.endsWith('Z')) {
      throw new Error('DateTimeUTC requires UTC format ending with Z.');
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid DateTimeUTC format: ${value}`);
    }

    return date;
  }

  serialize(value: unknown): string {
    if (!(value instanceof Date)) {
      throw new Error('DateTimeUTC serialize expects a Date object');
    }
    return value.toISOString();
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind !== Kind.STRING) {
      throw new Error('DateTimeUTC literal must be a string');
    }
    return this.parseValue(ast.value);
  }
}
