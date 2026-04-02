import { UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class FollowService extends Service {
  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.authService.validateToken(token);
    const followDao = this.factory.getFollowDao();
    const userDao = this.factory.getUserDao();
    const lastAlias = lastItem?.alias ?? null;
    const [aliases, hasMore] = await followDao.getPageOfFollowees(
      userAlias,
      pageSize,
      lastAlias
    );
    const users = await Promise.all(aliases.map((a) => userDao.getUser(a)));
    return [users.filter((u): u is UserDto => u !== null), hasMore];
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.authService.validateToken(token);
    const followDao = this.factory.getFollowDao();
    const userDao = this.factory.getUserDao();
    const lastAlias = lastItem?.alias ?? null;
    const [aliases, hasMore] = await followDao.getPageOfFollowers(
      userAlias,
      pageSize,
      lastAlias
    );
    const users = await Promise.all(aliases.map((a) => userDao.getUser(a)));
    return [users.filter((u): u is UserDto => u !== null), hasMore];
  }

  public async getIsFollowerStatus(
    token: string,
    userAlias: string,
    selectedUserAlias: string
  ): Promise<boolean> {
    await this.authService.validateToken(token);
    return this.factory
      .getFollowDao()
      .getIsFollower(userAlias, selectedUserAlias);
  }

  public async getFollowerCount(
    token: string,
    userAlias: string
  ): Promise<number> {
    await this.authService.validateToken(token);
    return this.factory.getUserDao().getFollowerCount(userAlias);
  }

  public async getFolloweeCount(
    token: string,
    userAlias: string
  ): Promise<number> {
    await this.authService.validateToken(token);
    return this.factory.getUserDao().getFolloweeCount(userAlias);
  }

  public async follow(
    token: string,
    user: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.authService.validateToken(token);
    const followerAlias = await this.getAliasFromToken(token);
    const followDao = this.factory.getFollowDao();
    const userDao = this.factory.getUserDao();

    await followDao.putFollow(followerAlias, user.alias);
    await Promise.all([
      userDao.updateFollowerCount(user.alias, 1),
      userDao.updateFolloweeCount(followerAlias, 1),
    ]);

    const [followerCount, followeeCount] = await Promise.all([
      userDao.getFollowerCount(user.alias),
      userDao.getFolloweeCount(user.alias),
    ]);
    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    user: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.authService.validateToken(token);
    const followerAlias = await this.getAliasFromToken(token);
    const followDao = this.factory.getFollowDao();
    const userDao = this.factory.getUserDao();

    await followDao.deleteFollow(followerAlias, user.alias);
    await Promise.all([
      userDao.updateFollowerCount(user.alias, -1),
      userDao.updateFolloweeCount(followerAlias, -1),
    ]);

    const [followerCount, followeeCount] = await Promise.all([
      userDao.getFollowerCount(user.alias),
      userDao.getFolloweeCount(user.alias),
    ]);
    return [followerCount, followeeCount];
  }

  private async getAliasFromToken(token: string): Promise<string> {
    const alias = await this.factory.getAuthTokenDao().getAliasForToken(token);
    if (!alias) {
      throw new Error("[bad-request] Token not found");
    }
    return alias;
  }
}
