import { FakeData, User, UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class FollowService implements Service {
  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null,
  ): Promise<[UserDto[], boolean]> {
    return this.getFakeData(lastItem, pageSize, userAlias);
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null,
  ): Promise<[UserDto[], boolean]> {
    return this.getFakeData(lastItem, pageSize, userAlias);
  }

  public async getIsFollowerStatus(
    _token: string,
    _userAlias: string,
    _selectedUserAlias: string,
  ): Promise<boolean> {
    return FakeData.instance.isFollower();
  }

  public async getFolloweeCount(
    _token: string,
    userAlias: string,
  ): Promise<number> {
    return FakeData.instance.getFolloweeCount(userAlias);
  }

  public async getFollowerCount(
    _token: string,
    userAlias: string,
  ): Promise<number> {
    return FakeData.instance.getFollowerCount(userAlias);
  }

  public async follow(
    token: string,
    user: UserDto,
  ): Promise<[followerCount: number, followeeCount: number]> {
    const followerCount = await this.getFollowerCount(token, user.alias);
    const followeeCount = await this.getFolloweeCount(token, user.alias);
    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    user: UserDto,
  ): Promise<[followerCount: number, followeeCount: number]> {
    const followerCount = await this.getFollowerCount(token, user.alias);
    const followeeCount = await this.getFolloweeCount(token, user.alias);
    return [followerCount, followeeCount];
  }

  private async getFakeData(
    lastItem: UserDto | null,
    pageSize: number,
    userAlias: string,
  ): Promise<[UserDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfUsers(
      User.fromDto(lastItem),
      pageSize,
      userAlias,
    );
    const dtos = items.map((user) => user.dto);
    return [dtos, hasMore];
  }
}
