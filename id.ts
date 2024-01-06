import * as g from "npm:graphql";
import { toDescriptionString } from "./annotation.ts";

/**
 * UUID 形式の ID の GraphQL の Scalar 型を作る
 */
export const createIdGraphQLScalarType = <IdType extends string>(
  name: string,
  parseFn?: (value: unknown) => IdType,
): g.GraphQLScalarType<IdType, string> =>
  new g.GraphQLScalarType<IdType, string>({
    name,
    description: "UUID のハイフン無し文字列 " +
      toDescriptionString({ type: "uuid" }),
    serialize: (value) => {
      if (typeof value === "string") {
        return value;
      }
      throw new Error(
        `${name} is not string in GraphQL Scalar ${name} serialize`,
      );
    },
    parseValue: parseFn ?? parseFnDefault,
    parseLiteral: (ast) => {
      if (ast.kind === g.Kind.STRING) {
        return (parseFn ?? parseFnDefault)(ast.value);
      }
      throw new Error(
        `${name} ast is not string in GraphQL Scalar ${name} parseLiteral`,
      );
    },
  });

const parseFnDefault = <const idType extends string>(value: unknown) => {
  if (typeof value === "string" && /^[0-9a-f]{32}$/u.test(value)) {
    return value as idType;
  }
  throw new Error(`Invalid Id
  actual: ${JSON.stringify(value)}
  expected: /^[0-9a-f]{32}$/ example: "445bf4f21ab920394c352dbdde962ea8"`);
};

/**
 * Id. 各種リソースを識別するために使うID. UUID(v4)やIPv6と同じ128bit, 16bytes.
 * 文字列には - (ハイフン)を含めない. 4セグメント目が1～5 という制約もない
 *
 * 小文字に統一して, 大文字は使わない. 長さは32文字
 * @example
 * createRandomId(); // "d3291006fc1a3526d833206e060a3c94"
 * createRandomId(); // "c04b1ae4c743f53cb8ea9ffdd802fcad"
 * createRandomId(); // "cc15d6b6f2e3fac1f1730c607451a132"
 */
export const createRandomId = (): string => {
  return binaryToHexString(crypto.getRandomValues(new Uint8Array(16)));
};

/**
 * トークン. 鍵となる 256bit, 32byte のランダムな値を生成する
 *
 * 小文字に統一して, 大文字は使わない. 長さは64文字
 * @example
 * createRandomToken(); // "5ab40791bfcd9e4288f7c725c35f6d99e7a564638f57c1cd845f858d79d6b300"
 * createRandomToken(); // "13bea4ba054caa5d401770305411d95f2eb7b494e58f33c17f4ad665782eb25d"
 * createRandomToken(); // "d7bffdc48057d9399a56ea8fbf78ec7ee1656d591803c83387ea52e875eaf9dd"
 */
export const createRandomToken = (): string => {
  return binaryToHexString(crypto.getRandomValues(new Uint8Array(32)));
};

/**
 * トークンの文字列をハッシュ化する
 * @param token {@link createRandomToken} で生成したトークン
 * @returns トークンのハッシュ値
 *
 * @example
 * hashToken("5ab40791bfcd9e4288f7c725c35f6d99e7a564638f57c1cd845f858d79d6b300") // "9c5ad18ea698d0f3b9725b817effc7289163d53ae070ea4ec869aaf7430a2980"
 */
export const hashToken = async (token: string): Promise<string> => {
  return binaryToHexString(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token)),
    ),
  );
};

const binaryToHexString = (binary: Uint8Array): string => {
  return [...binary].map((byte) => byte.toString(16).padStart(2, "0")).join("");
};
