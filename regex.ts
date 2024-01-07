import * as g from "npm:graphql";
import { toDescriptionString } from "./annotation.ts";

/**
 * 指定した正規表現を満たす文字列の型を作成する
 */
export const createRegexType = <IdType extends string>(
  parameter: {
    readonly name: string;
    readonly regex: RegExp;
    readonly description: string;
  },
): g.GraphQLScalarType<IdType, string> =>
  new g.GraphQLScalarType<IdType, string>({
    name,
    description: parameter.description +
      toDescriptionString({ type: "uuid" }),
    serialize: (value) => {
      if (typeof value === "string") {
        return value;
      }
      throw new Error(
        `${name} is not string in GraphQL Scalar ${name} serialize`,
      );
    },
    parseValue: (value) => regexFromString(name, value, parameter.regex),
    parseLiteral: (ast) => {
      if (ast.kind === g.Kind.STRING) {
        return regexFromString(name, ast.value, parameter.regex);
      }
      throw new Error(
        `${name} ast is not string in GraphQL Scalar ${name} parseLiteral`,
      );
    },
  });

const regexFromString = <const idType extends string>(
  typeName: string,
  value: unknown,
  regex: RegExp,
): idType => {
  if (typeof value === "string" && regex.test(value)) {
    return value as idType;
  }
  throw new Error(`Invalid ${typeName}
  actual: ${JSON.stringify(value)}
  expected: ${regex}`);
};
