import { UserDto } from "tweeter-shared";
import { IUserDao } from "../interface/IUserDao";
import { DynamoDAO } from "./DynamoDAO";

export class DynamoUserDao extends DynamoDAO implements IUserDao {
  private readonly TABLE = process.env.USERS_TABLE_NAME ?? "users";

  async createUser(
    firstName: string,
    lastName: string,
    alias: string,
    passwordHash: string,
    imageUrl: string
  ): Promise<void> {
    await this.put({
      TableName: this.TABLE,
      Item: {
        alias,
        firstName,
        lastName,
        imageUrl,
        passwordHash,
        followerCount: 0,
        followeeCount: 0,
      },
      ConditionExpression: "attribute_not_exists(alias)",
    });
  }

  async getUser(alias: string): Promise<UserDto | null> {
    const item = await this.get({ TableName: this.TABLE, Key: { alias } });
    if (!item) return null;
    return {
      alias: item.alias as string,
      firstName: item.firstName as string,
      lastName: item.lastName as string,
      imageUrl: item.imageUrl as string,
    };
  }

  async getPasswordHash(alias: string): Promise<string | null> {
    const item = await this.get({
      TableName: this.TABLE,
      Key: { alias },
      ProjectionExpression: "passwordHash",
    });
    return item ? (item.passwordHash as string) : null;
  }

  async updateFollowerCount(alias: string, delta: number): Promise<void> {
    await this.update({
      TableName: this.TABLE,
      Key: { alias },
      UpdateExpression: "SET followerCount = followerCount + :delta",
      ExpressionAttributeValues: { ":delta": delta },
    });
  }

  async updateFolloweeCount(alias: string, delta: number): Promise<void> {
    await this.update({
      TableName: this.TABLE,
      Key: { alias },
      UpdateExpression: "SET followeeCount = followeeCount + :delta",
      ExpressionAttributeValues: { ":delta": delta },
    });
  }

  async getFollowerCount(alias: string): Promise<number> {
    const item = await this.get({
      TableName: this.TABLE,
      Key: { alias },
      ProjectionExpression: "followerCount",
    });
    return item ? (item.followerCount as number) : 0;
  }

  async getFolloweeCount(alias: string): Promise<number> {
    const item = await this.get({
      TableName: this.TABLE,
      Key: { alias },
      ProjectionExpression: "followeeCount",
    });
    return item ? (item.followeeCount as number) : 0;
  }
}
