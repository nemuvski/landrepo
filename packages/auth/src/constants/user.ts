/**
 * パスワード入力の最大文字数
 *
 * ※ 新規登録やパスワード変更時にバリデーションで利用
 *
 * @see {@link https://github.com/kelektiv/node.bcrypt.js#security-issues-and-concerns} 72バイトの制限に注意
 */
export const MAX_LENGTH_PASSWORD = 64
