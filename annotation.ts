export type SimpleGraphQLAnnotation =
  | {
    /**
     * 一般的な文字列のバリデーションをする.
     * - 前後の空白は取り除く
     * - 空白の連続は1つの空白にまとめる
     * - 改行は空白として変換する
     * - 1文字以上
     * - UTF16バイト数での文字数制限
     */
    readonly type: "text";
    readonly maxLength: number;
  }
  | {
    /**
     * 時刻を表現する. UNIX 元期からの経過ミリ秒数
     */
    readonly type: "dateTime";
  }
  | { readonly type: "url" }
  | {
    readonly type: "regexp";
    /**
     * 正規表現の文字列 JavaScriptの正規表現リテラルの開始と終了の / や フラグは含まない
     */
    readonly pattern: string;
  };

/**
 * https://pub.dev/packages/simple_graphql_client_gen で解釈できるためのコメントを生成する
 *
 * 内部APIのため, 直接使うことはないはず
 */
export const toDescriptionString = (
  simpleGraphQLAnnotation: SimpleGraphQLAnnotation,
): string => {
  return (
    "\n\n### simpleGraphQLClientGenAnnotation\n```json\n" +
    JSON.stringify({
      $schema:
        "https://raw.githubusercontent.com/narumincho/simple_graphql_server_common/main/schema.json",
      ...simpleGraphQLAnnotation,
    }) +
    "\n```"
  );
};
