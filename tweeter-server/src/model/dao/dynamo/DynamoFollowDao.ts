import { IFollowDao } from "../interface/IFollowDao";
import { DynamoDAO } from "./DynamoDAO";

export class DynamoFollowDao extends DynamoDAO implements IFollowDao {
  private readonly TABLE = process.env.FOLLOWS_TABLE_NAME ?? "follows";
  private readonly GSI = "followee-index";

  async getPageOfFollowees(
    followerAlias: string,
    pageSize: number,
    lastFolloweeAlias: string | null
  ): Promise<[string[], boolean]> {
    const params: Record<string, unknown> = {
      TableName: this.TABLE,
      KeyConditionExpression: "follower_alias = :fa",
      ExpressionAttributeValues: { ":fa": followerAlias },
      Limit: pageSize,
      ScanIndexForward: true,
    };
    if (lastFolloweeAlias) {
      params.ExclusiveStartKey = {
        follower_alias: followerAlias,
        followee_alias: lastFolloweeAlias,
      };
    }
    const { items, lastKey } = await this.query(
      params as Parameters<typeof this.query>[0]
    );
    return [items.map((i) => i.followee_alias as string), !!lastKey];
  }

  async getPageOfFollowers(
    followeeAlias: string,
    pageSize: number,
    lastFollowerAlias: string | null
  ): Promise<[string[], boolean]> {
    const params: Record<string, unknown> = {
      TableName: this.TABLE,
      IndexName: this.GSI,
      KeyConditionExpression: "followee_alias = :fea",
      ExpressionAttributeValues: { ":fea": followeeAlias },
      Limit: pageSize,
      ScanIndexForward: true,
    };
    if (lastFollowerAlias) {
      params.ExclusiveStartKey = {
        followee_alias: followeeAlias,
        follower_alias: lastFollowerAlias,
      };
    }
    const { items, lastKey } = await this.query(
      params as Parameters<typeof this.query>[0]
    );
    return [items.map((i) => i.follower_alias as string), !!lastKey];
  }

  async getIsFollower(
    followerAlias: string,
    followeeAlias: string
  ): Promise<boolean> {
    const item = await this.get({
      TableName: this.TABLE,
      Key: { follower_alias: followerAlias, followee_alias: followeeAlias },
    });
    return !!item;
  }

  async putFollow(followerAlias: string, followeeAlias: string): Promise<void> {
    await this.put({
      TableName: this.TABLE,
      Item: { follower_alias: followerAlias, followee_alias: followeeAlias },
    });
  }

  async deleteFollow(
    followerAlias: string,
    followeeAlias: string
  ): Promise<void> {
    await this.delete({
      TableName: this.TABLE,
      Key: { follower_alias: followerAlias, followee_alias: followeeAlias },
    });
  }

  async getAllFollowers(followeeAlias: string): Promise<string[]> {
    const all: string[] = [];
    let lastKey: Record<string, unknown> | undefined;
    do {
      const params: Record<string, unknown> = {
        TableName: this.TABLE,
        IndexName: this.GSI,
        KeyConditionExpression: "followee_alias = :fea",
        ExpressionAttributeValues: { ":fea": followeeAlias },
        Limit: 100,
      };
      if (lastKey) params.ExclusiveStartKey = lastKey;
      const result = await this.query(params as Parameters<typeof this.query>[0]);
      all.push(...result.items.map((i) => i.follower_alias as string));
      lastKey = result.lastKey;
    } while (lastKey);
    return all;
  }
}
