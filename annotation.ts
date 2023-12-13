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
       * ファイルのハッシュ値である SHA256 や, AccountToken で使う
       *
       * 内部的には `5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9` のような16進数の文字列の表現
       */
      readonly type: "token";
    }
  | {
      /**
       * UUID. 16byteのバイナリ
       *
       * 内部的には `445bf4f21ab920394c352dbdde962ea8` のような16進数のハイフン無し文字列表現
       */
      readonly type: "uuid";
    }
  | {
      /**
       * 時刻を表現する. UNIX 元期からの経過ミリ秒数
       */
      readonly type: "dateTime";
    }
  | { readonly type: "url" };

export const toDescriptionString = (
  simpleGraphQLAnnotation: SimpleGraphQLAnnotation
) => {
  return (
    "\n\n### simpleGraphQLClientGenAnnotation\n```json\n" +
    JSON.stringify(simpleGraphQLAnnotation) +
    "\n```"
  );
};
