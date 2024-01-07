import * as g from "npm:graphql";
import { toDescriptionString } from "./annotation.ts";

/**
 * 先頭末尾の空白をなくし, 空白の連続を1つの空白にまとめ, 改行と全角空白(U+3000)を半角スペースに正規化する
 */
export const normalizeOneLineString = (input: string): string => {
  if (typeof input !== "string") {
    return "";
  }
  const normalized = input.trim();
  let result = "";
  let beforeSpace = false;
  for (const char of [...normalized]) {
    const codePoint = char.codePointAt(0);
    if (codePoint === undefined) {
      throw new Error("codePoint is undefined");
    }
    // 制御文字
    if ((codePoint > 0x1f && codePoint < 0x7f) || codePoint > 0xa0) {
      if (char === " " || char === "\u3000" || char === "\n") {
        if (!beforeSpace) {
          result += " ";
          beforeSpace = true;
        }
      } else {
        result += char;
        beforeSpace = false;
      }
    }
  }
  return result;
};

export const textFromString = <Name>(
  value: string,
  maxLength: number,
): Name => {
  const normalized = normalizeOneLineString(value);
  if (normalized.length === 0 || normalized.length > maxLength) {
    throw new Error("name is too long or empty");
  }
  return normalized as Name;
};

/**
 * 自動的に前後の空白や改行を取り除くような処理をする1行の文字列の型を作成する
 */
export const createTextGraphQLScalarType = <Name extends string>(
  name: string,
  maxLength: number,
): g.GraphQLScalarType<Name, string> =>
  new g.GraphQLScalarType<Name, string>({
    name,
    description:
      "文字数制限(1...50)と空白の連続がないというを満たしている名前" +
      toDescriptionString({
        type: "text",
        maxLength,
      }),
    serialize: (value) => {
      if (typeof value === "string") {
        return value;
      }
      throw new Error(
        `${name} is not string in GraphQL Scalar ${name} serialize`,
      );
    },
    parseValue: (value) => {
      if (typeof value !== "string") {
        throw new Error(
          `${name} is not string in GraphQL Scalar ${name} parseValue`,
        );
      }
      return textFromString<Name>(value, maxLength);
    },
    parseLiteral: (ast) => {
      if (ast.kind === g.Kind.STRING) {
        return textFromString<Name>(ast.value, maxLength);
      }
      throw new Error(
        `${name} ast is not string in GraphQL Scalar ${name} parseLiteral`,
      );
    },
  });
