import { StatusDto } from "tweeter-shared";
import { IStatusDao } from "../interface/IStatusDao";
import { DynamoDAO } from "./DynamoDAO";

export class DynamoStatusDao extends DynamoDAO implements IStatusDao {
  private readonly TABLE = process.env.STATUSES_TABLE_NAME ?? "statuses";

  async putStatus(status: StatusDto): Promise<void> {
    await this.put({
      TableName: this.TABLE,
      Item: {
        author_alias: status.user.alias,
        timestamp: status.timestamp,
        post: status.post,
        author_firstName: status.user.firstName,
        author_lastName: status.user.lastName,
        author_imageUrl: status.user.imageUrl,
      },
    });
  }

  async getPageOfStatuses(
    authorAlias: string,
    pageSize: number,
    lastTimestamp: number | null
  ): Promise<[StatusDto[], boolean]> {
    const params: Record<string, unknown> = {
      TableName: this.TABLE,
      KeyConditionExpression: "author_alias = :aa",
      ExpressionAttributeValues: { ":aa": authorAlias },
      Limit: pageSize,
      ScanIndexForward: false,
    };
    if (lastTimestamp !== null) {
      params.ExclusiveStartKey = {
        author_alias: authorAlias,
        timestamp: lastTimestamp,
      };
    }
    const { items, lastKey } = await this.query(
      params as Parameters<typeof this.query>[0]
    );
    return [items.map(this.itemToStatusDto), !!lastKey];
  }

  private itemToStatusDto(item: Record<string, unknown>): StatusDto {
    return {
      post: item.post as string,
      timestamp: item.timestamp as number,
      user: {
        alias: item.author_alias as string,
        firstName: item.author_firstName as string,
        lastName: item.author_lastName as string,
        imageUrl: item.author_imageUrl as string,
      },
    };
  }
}
