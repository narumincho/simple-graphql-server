import * as g from "npm:graphql";
import { toDescriptionString } from "./annotation.ts";

/**
 * 指定した正規表現を満たす文字列の型を作成する
 */
export const createRegExpType = <IdType extends string>(
  parameter: {
    readonly name: string;
    readonly regexp: RegExp;
    readonly description: string;
  },
): g.GraphQLScalarType<IdType, string> =>
  new g.GraphQLScalarType<IdType, string>({
    name: parameter.name,
    description: parameter.description +
      toDescriptionString({
        type: "regexp",
        pattern: parameter.regexp.source,
      }),
    serialize: (value) => {
      if (typeof value === "string") {
        return value;
      }
      throw new Error(
        `${parameter.name} is not string in GraphQL Scalar ${parameter.name} serialize`,
      );
    },
    parseValue: (value) =>
      regexpFromString(parameter.name, value, parameter.regexp),
    parseLiteral: (ast) => {
      if (ast.kind === g.Kind.STRING) {
        return regexpFromString(parameter.name, ast.value, parameter.regexp);
      }
      throw new Error(
        `${parameter.name} ast is not string in GraphQL Scalar ${parameter.name} parseLiteral`,
      );
    },
  });

const regexpFromString = <const idType extends string>(
  typeName: string,
  value: unknown,
  regexp: RegExp,
): idType => {
  if (typeof value === "string" && regexp.test(value)) {
    return value as idType;
  }
  throw new Error(`Invalid ${typeName}
  actual: ${JSON.stringify(value)}
  expected: ${regexp}`);
};
