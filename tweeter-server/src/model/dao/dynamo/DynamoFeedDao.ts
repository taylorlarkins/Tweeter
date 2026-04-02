import { StatusDto } from "tweeter-shared";
import { IFeedDao } from "../interface/IFeedDao";
import { DynamoDAO } from "./DynamoDAO";

export class DynamoFeedDao extends DynamoDAO implements IFeedDao {
  private readonly TABLE = process.env.FEED_TABLE_NAME ?? "feed";

  async putFeedItems(
    followerAliases: string[],
    status: StatusDto
  ): Promise<void> {
    if (followerAliases.length === 0) return;
    const items = followerAliases.map((alias) =>
      this.buildFeedItem(alias, status)
    );
    await this.batchWrite(this.TABLE, items);
  }

  async getPageOfFeedItems(
    followerAlias: string,
    pageSize: number,
    lastTimestamp: number | null
  ): Promise<[StatusDto[], boolean]> {
    const params: Record<string, unknown> = {
      TableName: this.TABLE,
      KeyConditionExpression: "follower_alias = :fa",
      ExpressionAttributeValues: { ":fa": followerAlias },
      Limit: pageSize,
      ScanIndexForward: false,
    };
    if (lastTimestamp !== null) {
      params.ExclusiveStartKey = {
        follower_alias: followerAlias,
        timestamp: lastTimestamp,
      };
    }
    const { items, lastKey } = await this.query(
      params as Parameters<typeof this.query>[0]
    );
    return [
      items.map((item) => ({
        post: item.post as string,
        timestamp: item.timestamp as number,
        user: {
          alias: item.author_alias as string,
          firstName: item.author_firstName as string,
          lastName: item.author_lastName as string,
          imageUrl: item.author_imageUrl as string,
        },
      })),
      !!lastKey,
    ];
  }

  private buildFeedItem(
    followerAlias: string,
    status: StatusDto
  ): Record<string, unknown> {
    return {
      follower_alias: followerAlias,
      timestamp: status.timestamp,
      post: status.post,
      author_alias: status.user.alias,
      author_firstName: status.user.firstName,
      author_lastName: status.user.lastName,
      author_imageUrl: status.user.imageUrl,
    };
  }
}
