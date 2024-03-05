import * as g from "npm:graphql@16";
import { toDescriptionString } from "./annotation.ts";

export const Url: g.GraphQLScalarType<URL, string> = new g.GraphQLScalarType<
  URL,
  string
>({
  name: "Url",
  description: "URL 各言語の標準のURLとして扱う" +
    toDescriptionString({
      type: "url",
    }),
  serialize: (value) => {
    if (value instanceof URL) {
      return value.toString();
    }
    throw new Error("url is not URL in Url serialize");
  },
  parseValue: (value) => {
    if (typeof value !== "string") {
      throw new Error("url is not string in Url parseValue");
    }
    try {
      return new URL(value);
    } catch (_error) {
      throw new Error(value + " is not valid URL");
    }
  },
  parseLiteral: (ast) => {
    if (ast.kind === g.Kind.STRING) {
      try {
        return new URL(ast.value);
      } catch (_error) {
        throw new Error(ast.value + " is not valid URL");
      }
    }
    throw new Error("Url ast is not string in Url parseLiteral");
  },
});
