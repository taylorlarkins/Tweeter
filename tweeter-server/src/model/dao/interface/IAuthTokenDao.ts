export interface IAuthTokenDao {
  putAuthToken(token: string, timestamp: number, alias: string): Promise<void>;

  getAuthTokenTimestamp(token: string): Promise<number | null>;

  getAliasForToken(token: string): Promise<string | null>;

  updateAuthTokenTimestamp(token: string, newTimestamp: number): Promise<void>;

  deleteAuthToken(token: string): Promise<void>;
}
