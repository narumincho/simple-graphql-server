import * as g from "npm:graphql@16";
import { toDescriptionString } from "./annotation.ts";

const dateTimeTypeSerialize: g.GraphQLScalarSerializer<number> = (
  value,
): number => {
  if (value instanceof Date) {
    return value.getTime();
  }
  throw new Error("value is not Date in dateTimeTypeSerialize");
};

const dateTimeTypeParseValue: g.GraphQLScalarValueParser<Date> = (
  value,
): Date => {
  if (typeof value === "number") {
    return new Date(value);
  }
  throw new Error("value is not number in dateTimeTypeParseValue");
};

const dateTimeTypeParseLiteral: g.GraphQLScalarLiteralParser<Date> = (ast) => {
  if (ast.kind === g.Kind.FLOAT || ast.kind === g.Kind.INT) {
    try {
      return new Date(Number.parseInt(ast.value, 10));
    } catch {
      return new Date();
    }
  }
  return new Date();
};

const dateTimeTypeConfig: g.GraphQLScalarTypeConfig<Date, number> = {
  name: "DateTime",
  description:
    "日付と時刻。1970年1月1日 00:00:00 UTCから指定した日時までの経過時間をミリ秒で表した数値 2038年問題を回避するために64bitFloatの型を使う" +
    toDescriptionString({ type: "dateTime" }),
  serialize: dateTimeTypeSerialize,
  parseValue: dateTimeTypeParseValue,
  parseLiteral: dateTimeTypeParseLiteral,
};

export const DateTime: g.GraphQLScalarType<Date, number> = new g
  .GraphQLScalarType(dateTimeTypeConfig);
