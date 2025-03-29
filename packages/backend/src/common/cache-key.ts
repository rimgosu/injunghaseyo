export class CacheKeyConstants {
  static readonly TEMP_PASSWORD_EMAIL = (email: string) => {
    return `temp:password:${email}`;
  };

  static readonly VERIFIED_EMAIL = (email: string) => {
    return `verified:${email}`;
  };

  static readonly CODE = (email: string) => {
    return `code:${email}`;
  };

  static readonly BLACKLIST_ATK = (atk: string) => {
    return `blacklist:atk:${atk}`;
  };
}
