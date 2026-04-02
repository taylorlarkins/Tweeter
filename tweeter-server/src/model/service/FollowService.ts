import { UserDto } from "tweeter-shared";
import { IAuthTokenDao } from "../dao/interface/IAuthTokenDao";
import { IFollowDao } from "../dao/interface/IFollowDao";
import { IUserDao } from "../dao/interface/IUserDao";
import { Service } from "./Service";

export class FollowService extends Service {
  private readonly followDao: IFollowDao;
  private readonly userDao: IUserDao;
  private readonly authTokenDao: IAuthTokenDao;

  constructor() {
    super();
    this.followDao = this.factory.getFollowDao();
    this.userDao = this.factory.getUserDao();
    this.authTokenDao = this.factory.getAuthTokenDao();
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.authService.validateToken(token);
    const lastAlias = lastItem?.alias ?? null;
    const [aliases, hasMore] = await this.followDao.getPageOfFollowees(
      userAlias,
      pageSize,
      lastAlias
    );
    const users = await Promise.all(aliases.map((a) => this.userDao.getUser(a)));
    return [users.filter((u): u is UserDto => u !== null), hasMore];
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.authService.validateToken(token);
    const lastAlias = lastItem?.alias ?? null;
    const [aliases, hasMore] = await this.followDao.getPageOfFollowers(
      userAlias,
      pageSize,
      lastAlias
    );
    const users = await Promise.all(aliases.map((a) => this.userDao.getUser(a)));
    return [users.filter((u): u is UserDto => u !== null), hasMore];
  }

  public async getIsFollowerStatus(
    token: string,
    userAlias: string,
    selectedUserAlias: string
  ): Promise<boolean> {
    await this.authService.validateToken(token);
    return this.followDao.getIsFollower(userAlias, selectedUserAlias);
  }

  public async getFollowerCount(
    token: string,
    userAlias: string
  ): Promise<number> {
    await this.authService.validateToken(token);
    return this.userDao.getFollowerCount(userAlias);
  }

  public async getFolloweeCount(
    token: string,
    userAlias: string
  ): Promise<number> {
    await this.authService.validateToken(token);
    return this.userDao.getFolloweeCount(userAlias);
  }

  public async follow(
    token: string,
    user: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.authService.validateToken(token);
    const followerAlias = await this.getAliasFromToken(token);

    await this.followDao.putFollow(followerAlias, user.alias);
    await Promise.all([
      this.userDao.updateFollowerCount(user.alias, 1),
      this.userDao.updateFolloweeCount(followerAlias, 1),
    ]);

    const [followerCount, followeeCount] = await Promise.all([
      this.userDao.getFollowerCount(user.alias),
      this.userDao.getFolloweeCount(user.alias),
    ]);
    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    user: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.authService.validateToken(token);
    const followerAlias = await this.getAliasFromToken(token);

    await this.followDao.deleteFollow(followerAlias, user.alias);
    await Promise.all([
      this.userDao.updateFollowerCount(user.alias, -1),
      this.userDao.updateFolloweeCount(followerAlias, -1),
    ]);

    const [followerCount, followeeCount] = await Promise.all([
      this.userDao.getFollowerCount(user.alias),
      this.userDao.getFolloweeCount(user.alias),
    ]);
    return [followerCount, followeeCount];
  }

  private async getAliasFromToken(token: string): Promise<string> {
    const alias = await this.authTokenDao.getAliasForToken(token);
    if (!alias) {
      throw new Error("[bad-request] Token not found");
    }
    return alias;
  }
}
