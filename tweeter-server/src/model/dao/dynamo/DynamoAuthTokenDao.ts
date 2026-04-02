import { IAuthTokenDao } from "../interface/IAuthTokenDao";
import { DynamoDAO } from "./DynamoDAO";

const TOKEN_DURATION_SECS = 24 * 60 * 60; // 24 hours

export class DynamoAuthTokenDao extends DynamoDAO implements IAuthTokenDao {
  private readonly TABLE = process.env.AUTH_TOKENS_TABLE_NAME ?? "auth_tokens";

  async putAuthToken(
    token: string,
    timestamp: number,
    alias: string
  ): Promise<void> {
    await this.put({
      TableName: this.TABLE,
      Item: {
        token,
        timestamp,
        alias,
        ttl: Math.floor(Date.now() / 1000) + TOKEN_DURATION_SECS,
      },
    });
  }

  async getAuthTokenTimestamp(token: string): Promise<number | null> {
    const item = await this.get({
      TableName: this.TABLE,
      Key: { token },
      ProjectionExpression: "#ts",
      ExpressionAttributeNames: { "#ts": "timestamp" },
    });
    return item ? (item.timestamp as number) : null;
  }

  async getAliasForToken(token: string): Promise<string | null> {
    const item = await this.get({
      TableName: this.TABLE,
      Key: { token },
      ProjectionExpression: "alias",
    });
    return item ? (item.alias as string) : null;
  }

  async updateAuthTokenTimestamp(
    token: string,
    newTimestamp: number
  ): Promise<void> {
    await this.update({
      TableName: this.TABLE,
      Key: { token },
      UpdateExpression: "SET #ts = :ts, #ttl = :ttl",
      ExpressionAttributeNames: { "#ts": "timestamp", "#ttl": "ttl" },
      ExpressionAttributeValues: {
        ":ts": newTimestamp,
        ":ttl": Math.floor(Date.now() / 1000) + TOKEN_DURATION_SECS,
      },
    });
  }

  async deleteAuthToken(token: string): Promise<void> {
    await this.delete({ TableName: this.TABLE, Key: { token } });
  }
}
